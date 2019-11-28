from selenium import webdriver
from selenium.webdriver.common.by import By 
from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.support import expected_conditions as EC 
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import Select
from datetime import datetime, date, time, timedelta

MONTH_DICT={
    "January":1,
    "February":2,
    "March":3,
    "April":4,
    "May":5,
    "June":6,
    "July":7,
    "August":8,
    "September":9,
    "October":10,
    "November":11,
    "December":12
}


class RoomFinder():
    '''
    RoomFinder encapsulates all functions and variables related to
    finding a study room for a meeting.
    '''
    def __init__(self):
        self.option = webdriver.ChromeOptions()
        self.option.add_argument(" - incognito")
        self.driver = webdriver.Chrome()
        self.driver.implicitly_wait(30)
        self.base_url = "http://calendar.library.ucla.edu/reserve"
        self.verificationErrors = []
        self.accept_next_alert = True
        self.driver.get(self.base_url)
    '''
    Returns a tuple (datetime, string)
    Representing the available start times of 30 min blocks,
    and the location of study room.
    '''
    def process_info_str(self, info_string):
        return ""

    '''
    Returns a list of available tuples (datetime, string)
    Representing the starttime of 30min blocks on the website
    and the location of study room.
    '''
    def get_avail_blocks(self):
        driver = self.driver
        try:
            avail_block_elems = driver.find_elements_by_class_name("s-lc-eq-avail")
            return [
                self. process_info_str(
                    block_elem.get_attribute("innerText")
                ) for block_elem in avail_block_elems
            ]
        except selenium.common.exceptions.NoSuchElementException as error:
            return []

    '''
    Check for valid meeting size and select the appropriate size on webpage.
    '''
    def handle_meeting_size(self, meeting_size):
        if meeting_size < 0:
            return False
        elif meeting_size < 5:
            Select(
                driver.find_element_by_id("capacity")
            ).select_by_visible_text("For 1-4 people")
        elif meeting_size < 9:
            Select(
                driver.find_element_by_id("capacity")
            ).select_by_visible_text("For 5-8 people")
        elif meeting_size < 13:
            Select(
                driver.find_element_by_id("capacity")
            ).select_by_visible_text("For 9-12 people")
        else:
            Select(
                driver.find_element_by_id("capacity")
            ).select_by_visible_text("For 13+ people")
        return True

    '''
    Check for valid date, only allows for booking one week in advance.
    Also sets the date on driver
    Returns false if not valid, true otherwise.
    '''
    def handle_meeting_date(self, req_datetime):
        cur_dates = driver.find_element_by_class_name(
            "fc-left"
        ).get_attribute("innerText").split('\n')[0]

        start_date = cur_dates.split('–')[0].strip(' ').split(',')
        site_start_date = datetime(
            year=int(start_date[2].strip(' ')),
            month=MONTH_DICT[start_date[1].strip(' ').split()[0]],
            day=start_date[1].strip(' ').split()[0],
            hour=req_datetime.hour,
            minute=req_datetime.minute
        )
        end_date = cur_dates.split('–')[1].strip(' ').split(',')
        site_end_date = datetime(
            year=int(end_date[2].strip(' ')),
            month=MONTH_DICT[end_date[1].strip(' ').split()[0]],
            day=end_date[1].strip(' ').split()[0],
            hour=req_datetime.hour,
            minute=req_datetime.minute
        )

        if req_datetime < site_start_date:
            return False
        if req_datetime > site_end_date:
            num_clicks = ((req_datetime - site_end_date).day - 1) / 3 + 1
            for i in range(0, num_clicks):
                buttons = driver.find_elements_by_class_name("fc-next-button")
                for button in buttons:
                    button.click()

    '''
    Return list of tuples with start time, end time, location
    datetimes: List[(start_time: datetime, end_time: datetime)]
    times sorted in order.
    '''
    def get_avail_studyroom(self, size, datetimes, duration):
        if len(datetimes) == 0:
            return []
        drive = self.driver
        if not self.check_meeting_size(size):
            return []
        Select(
            driver.find_element_by_id("lid")
        ).select_by_visible_text("View All Locations")

        avail_blocks_unmerged = []
        cur_day = 0
        cur_blocks = []
        for (req_start_time, req_end_time) in datetimes:
            if cur_day != req_start_time.day:
                cur_day = req_start_time.day
                self.handle_meeting_date(req_start_time)
                cur_blocks = self.get_avail_blocks()
            # Append all blocks within cur req interval
            avail_blocks_unmerged += [
                (
                    start_time, 
                    start_time + timedelta(seconds=30*60), 
                    location
                ) if (
                    start_time >= req_start_time and
                    start_time + timedelta(seconds=30*60) <= req_end_time
                ) for (start_time, location) in cur_blocks
            ]

        return avail_blocks_unmerged