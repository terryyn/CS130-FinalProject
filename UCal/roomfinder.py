#!/usr/local/bin/python
# coding=utf-8

import json
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import Select
from datetime import datetime, date, time, timedelta
from webdriver_manager.chrome import ChromeDriverManager


from datetime import datetime, timedelta

class RoomFinder():
    MONTH_DICT = {
        "January": 1,
        "February": 2,
        "March": 3,
        "April": 4,
        "May": 5,
        "June": 6,
        "July": 7,
        "August": 8,
        "September": 9,
        "October": 10,
        "November": 11,
        "December": 12
    }
    TIME_FORMAT_STR = "%I:%M%p %A, %B %d, %Y "
    ERROR_CODE = {
        1: "No available time ranges selected. Please select at least one.",
        2: "Meeting size greater than any study room can accomodate.",
        3: "No available study rooms for the time range(s) selected."
    }
    LOCATION_DICT = {
        'Powell Group Study Room A': 'Powell Group Study Rooms', 
        'Powell Group Study Room B': 'Powell Group Study Rooms', 
        'Powell Group Study Room C': 'Powell Group Study Rooms', 
        'Powell Group Study Room D': 'Powell Group Study Rooms', 
        'Powell Group Study Room E': 'Powell Group Study Rooms', 
        'Powell Group Study Room F': 'Powell Group Study Rooms',
        'YRL Collaboration Pod R01': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R02': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R03': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R04': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R05': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R06': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R07': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R08': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R09': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R10': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R11': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R12': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R13': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R14': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R15': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R16': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R17': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R18': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R19': 'YRL Collaboration Pods',
        'YRL Collaboration Pod R20': 'YRL Collaboration Pods',
        'YRL Group Study Room G01': 'YRL Group Study Rooms',
        'YRL Group Study Room G02': 'YRL Group Study Rooms',
        'YRL Group Study Room G03': 'YRL Group Study Rooms',
        'YRL Group Study Room G04': 'YRL Group Study Rooms',
        'YRL Group Study Room G05': 'YRL Group Study Rooms',
        'YRL Group Study Room G06': 'YRL Group Study Rooms',
        'YRL Group Study Room G07': 'YRL Group Study Rooms',
        'YRL Group Study Room G08': 'YRL Group Study Rooms',
        'YRL Group Study Room G09': 'YRL Group Study Rooms',
        'YRL Group Study Room G10': 'YRL Group Study Rooms',
        'YRL Group Study Room G11': 'YRL Group Study Rooms',
        'YRL Group Study Room G12': 'YRL Group Study Rooms',
        'YRL Group Study Room G13': 'YRL Group Study Rooms',
        'YRL Group Study Room G14': 'YRL Group Study Rooms',
        'YRL Group Study Room G15': 'YRL Group Study Rooms',
        '12-077E Group Study Room': 'Biomedical Library',
        'Collaboration Pod': 'Biomedical Library'
    }
    '''
    RoomFinder encapsulates all functions and variables related to
    finding a study room for a meeting.
    '''
    def __init__(self, request_json, setup="dev"):
        self.option = webdriver.ChromeOptions()
        if setup == "dev":
            self.option.add_argument("headless")
        else:
            self.option.add_argument(" - incognito")
        self.driver = webdriver.Chrome(chrome_options=self.option)
        self.driver.implicitly_wait(30)
        self.base_url = "http://calendar.library.ucla.edu/reserve"
        self.verificationErrors = []
        self.accept_next_alert = True
        self.driver.get(self.base_url)
        Select(
            self.driver.find_element_by_id("lid")
        ).select_by_visible_text("View All Locations")
        meeting_size, duration, datetimes = self.read_req_json(request_json)
        self.meeting_size = meeting_size
        self.duration = duration
        self.datetimes = datetimes

    '''
    Returns a tuple (datetime, string)
    Representing the available start times of 30 min blocks,
    and the location of study room.
    '''
    @classmethod
    def process_info_str(cls, info_str):
        info_arr = info_str.split("-", 5)
        location = ""
        if info_arr[1].strip() != "12":
            location = info_arr[1].strip()
        else:
            location = info_arr[1] + "-" + info_arr[2].strip()
        return (
            datetime.strptime(info_arr[0], cls.TIME_FORMAT_STR),
            location
        )
            

    '''
    Read the request json passed from frontend and format into
    arguments to be passed to the actual function.
    '''
    @classmethod
    def read_req_json(self, req_json):
        meeting_size = int(req_json["meeting_size"])
        duration = int(req_json["duration"])
        datetimes = []
        dt_str_arr = req_json["datetimes"].split(",")
        for dt_str in dt_str_arr:
            dt_arr = dt_str.split("-")
            dt_str = ('-').join(dt_arr[:3])
            start_time = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
            end_time_temp = datetime.strptime(dt_arr[3], "%H:%M%S")
            end_time = datetime(
                year=start_time.year,
                month=start_time.month,
                day=start_time.day,
                hour=end_time_temp.hour,
                minute=end_time_temp.minute
            )
            datetimes.append((start_time, end_time))
        return meeting_size, duration, datetimes

    '''
    Returns a list of available tuples (datetime, string)
    Representing the starttime of 30min blocks on the website
    and the location of study room.
    '''
    def get_avail_blocks(self):
        driver = self.driver
        try:
            avail_block_elems = driver.find_elements_by_class_name(
                "s-lc-eq-avail"
            )
            return [
                self.process_info_str(
                    block_elem.get_attribute("innerText")
                ) for block_elem in avail_block_elems
            ]
        except NoSuchElementException as error:
            return []

    '''
    Check for valid meeting size and select the appropriate size on webpage.
    '''
    def handle_meeting_size(self):
        if self.meeting_size < 0:
            return False
        elif self.meeting_size < 5:
            Select(
                self.driver.find_element_by_id("capacity")
            ).select_by_visible_text("For 1-4 people")
        elif self.meeting_size < 9:
            Select(
                self.driver.find_element_by_id("capacity")
            ).select_by_visible_text("For 5-8 people")
        elif self.meeting_size < 13:
            Select(
                self.driver.find_element_by_id("capacity")
            ).select_by_visible_text("For 9-12 people")
        else:
            Select(
                self.driver.find_element_by_id("capacity")
            ).select_by_visible_text("For 13+ people")
        return True

    '''
    Check for valid date, only allows for booking one week in advance.
    Also sets the date on driver
    Returns false if not valid, true otherwise.
    '''
    def handle_meeting_date(self, req_datetime):
        cur_dates = self.driver.find_element_by_tag_name(
            "h2"
        ).get_attribute("innerText").split('\n')[0]
            
        start_date = cur_dates.split('–')[0].strip(' ').split(',')
        site_start_date = datetime(
            year=int(start_date[2].strip(' ')),
            month=self.MONTH_DICT[start_date[1].strip(' ').split()[0]],
            day=int(start_date[1].strip(' ').split()[1]),
            hour=req_datetime.hour,
            minute=req_datetime.minute
        )
        end_date = cur_dates.split('–')[1].strip(' ').split(',')
        site_end_date = datetime(
            year=int(end_date[2].strip(' ')),
            month=self.MONTH_DICT[end_date[1].strip(' ').split()[0]],
            day=int(end_date[1].strip(' ').split()[1]),
            hour=req_datetime.hour,
            minute=req_datetime.minute
        )

        if req_datetime < site_start_date:
            return False
        if req_datetime > site_end_date:
            num_clicks = int(((req_datetime - site_end_date).days - 1) / 3 + 1)
            for i in range(0, num_clicks):
                buttons = self.driver.find_elements_by_class_name(
                    "fc-next-button"
                )
                for button in buttons:
                    button.click()

    '''
    Return list of tuples with start time, end time, location
    datetimes: List[(start_time: datetime, end_time: datetime)]
    times sorted in order.
    '''
    def get_filtered_avail_blocks(self):
        filtered_blocks = []
        cur_day = 0
        cur_blocks = []
        for (req_start_time, req_end_time) in self.datetimes:
            if cur_day != req_start_time.day:
                cur_day = req_start_time.day
                self.handle_meeting_date(req_start_time)
                cur_blocks = self.get_avail_blocks()
            # Append all blocks within cur req interval
            filtered_blocks += [
                (start_time, location)
                for (start_time, location) in cur_blocks
                if (
                    start_time >= req_start_time and
                    start_time + timedelta(seconds=30*60) <= req_end_time
                )
            ]
        return filtered_blocks

    def merge_avail_blocks(self, blocks):
        if len(blocks) == 0:
            return blocks
        sorted_blocks = sorted(blocks, key=lambda x: x[1])
        merged_blocks = []
        cur_timeslot = [sorted_blocks[0]]
        prev_block = sorted_blocks[0]
        for i in range(1, len(sorted_blocks)):
            cur_block = sorted_blocks[i]
            if (
                cur_block[0] - prev_block[0] == timedelta(minutes=30) and
                cur_block[1] == prev_block[1]
            ):
                cur_timeslot.append(cur_block)
            elif (
                cur_block[0] != prev_block[0] or
                cur_block[1] != prev_block[1]
            ):
                cur_timeslot = [cur_block]
            if len(cur_timeslot) >= self.duration:
                merged_blocks.append(cur_timeslot[len(cur_timeslot)-self.duration])
            prev_block = cur_block
        merged_blocks = list(set(merged_blocks))
        return merged_blocks

    @classmethod
    def summarize_location(cls, time_loc):
        summarized_time_loc = {}
        for time in time_loc.keys():
            cur_sum_dict = {}
            for loc in time_loc[time]:
                loc = loc.strip()
                sum_loc = cls.LOCATION_DICT[loc]
                if sum_loc in cur_sum_dict:
                    cur_sum_dict[sum_loc] += "," + loc
                else:
                    cur_sum_dict[sum_loc] = loc
            cur_sum_arr = []
            for location, room in cur_sum_dict.items():
                cur_sum_arr.append(location + ":" + room)
            summarized_time_loc[time] = cur_sum_arr
        return summarized_time_loc

    '''
    Takes in parameters: 
        size: int, (meeting size)
        datetimes: [(datetime, datetime)], (start time and end time)
        duration: int (number of 30 minutes)
    Returns Tuple(Boolean, List[Tuple(datetime, datetime, string)])
    Boolean represents whether a timeslot equal to or longer than the duration
    of the meeting can be found.
    If found, the list contain info on available study rooms.
    Otherwise, returns info on all available blocks that fall in the time
    ranges stated in datetimes.
    '''
    def find_room(self):
        if len(self.datetimes) == 0:
            return json.dumps({
                "Error": self.ERROR_CODE[1],
                "Timeslots": {}
            })
        if not self.handle_meeting_size():
            return json.dumps({
                "Error": self.ERROR_CODE[2],
                "Timeslots": {}
            })
        avail_blocks = self.get_filtered_avail_blocks()
        avail_timeslots = self.merge_avail_blocks(avail_blocks)
        if len(avail_timeslots) == 0:
            return json.dumps({
                "Error": self.ERROR_CODE[3],
                "Timeslots": {}
            })
        avail_timeslots = sorted(avail_timeslots, key=lambda x: x[0])
        prev = avail_timeslots[0]
        ts_loc = {prev[0].strftime("%Y-%m-%d %H:%M"): []}
        for ts in avail_timeslots:
            if ts[0] == prev[0]:
                ts_loc[prev[0].strftime("%Y-%m-%d %H:%M")].append(ts[1])
            else:
                ts_loc[ts[0].strftime("%Y-%m-%d %H:%M")] = [ts[1]]
            prev = ts
        return json.dumps({
            "Error": "",
            "Timeslots": self.summarize_location(ts_loc)
        })
