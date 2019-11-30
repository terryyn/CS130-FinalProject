from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import Select
from datetime import datetime, date, time, timedelta

MONTH_DICT={
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


class RoomFinder():
    TIME_FORMAT_STR = "%I:%M%p %A, %B %d, %Y "
    ERROR_CODE = {
        1: "No available time ranges selected. Please select at least one.",
        2: "Meeting size greater than any study room can accomodate.",
        3: "No available study rooms for the duration selected. Consider choosing multiple rooms?",
        4: "No available study rooms for the time range(s) selected."
    }
    '''
    RoomFinder encapsulates all functions and variables related to
    finding a study room for a meeting.
    '''
    def __init__(self, setup="dev", request_json):
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
        return (
            datetime.strptime(info_arr[0], cls.TIME_FORMAT_STR), 
            info_arr[1].strip()
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
        dt_str_arr = req_json["datetimes"].split("&")
        for dt_str in dt_str_arr:
            dt_arr = dt_str.split("^")
            start_time = datetime.strptime(dt_arr[0], "%Y-%m-%d %H:%M")
            end_time = datetime.strptime(dt_arr[1], "%Y-%m-%d %H:%M")
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
        cur_dates = self.driver.find_element_by_class_name(
            "fc-left"
        ).get_attribute("innerText").split('\n')[0]

        start_date = cur_dates.split('–')[0].strip(' ').split(',')
        site_start_date = datetime(
            year=int(start_date[2].strip(' ')),
            month=MONTH_DICT[start_date[1].strip(' ').split()[0]],
            day=int(start_date[1].strip(' ').split()[1]),
            hour=req_datetime.hour,
            minute=req_datetime.minute
        )
        end_date = cur_dates.split('–')[1].strip(' ').split(',')
        site_end_date = datetime(
            year=int(end_date[2].strip(' ')),
            month=MONTH_DICT[end_date[1].strip(' ').split()[0]],
            day=int(end_date[1].strip(' ').split()[1]),
            hour=req_datetime.hour,
            minute=req_datetime.minute
        )

        if req_datetime < site_start_date:
            return False
        if req_datetime > site_end_date:
            num_clicks = ((req_datetime - site_end_date).day - 1) / 3 + 1
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
        merged_blocks = []
        cur_timeslot = [blocks[0]]
        prev_block = blocks[0]
        for i in range(1, len(blocks)):
            cur_block = blocks[i]
            if cur_block[0] - prev_block[0] == timedelta(minutes=30):
                cur_timeslot.append(cur_block)
            else:
                cur_timeslot = []
            if len(cur_timeslot) == self.duration:
                merged_blocks.append(cur_timeslot.pop(0))
            prev_block = cur_block
        return merged_blocks


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
                "Timeslots": []
            })
        if not self.handle_meeting_size():
            return json.dumps({
                "Error": self.ERROR_CODE[2],
                "Timeslots": []
            })
        avail_blocks = self.get_filtered_avail_blocks()
        avail_timeslots = self.merge_avail_blocks(avail_blocks)
        if len(avail_timeslots) == 0:
            if len(avail_blocks) != 0:
                return json.dumps({
                    "Error": self.ERROR_CODE[3],
                    "Timeslots": avail_blocks
                })
            else:
                return json.dumps({
                    "Error": self.ERROR_CODE[4],
                    "Timeslots": avail_blocks
                })
        return json.dumps({
            "Error": "", 
            "Timeslots": avail_timeslots
        })
