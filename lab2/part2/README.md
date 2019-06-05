# Analysis of Udacity engagement data
## Data description
Data is taken from Udacity course ["Intro to Data Analysis"](https://www.udacity.com/course/intro-to-data-analysis--ud170): it's description of engagement of random subset of students who was taking Data Analyst Nanodegree.

### Data files
#### Enrollments

Data about a random subset of Data Analyst Nanodegree students who complete
their first project and a random subset of students who do not.

##### Columns:
  * __account_key__: A unique identifier for the account of the student who enrolled.
  * __status__: The enrollment status of the student at the time the data was collected. Possible values are 'canceled' and 'current'. 
  * __join_date__: The date the student enrolled.
  * __cancel_date__: The date the student canceled, or blank if the student has not yet canceled.
  * __days_to_cancel__: The number of days between join_date and cancel_date, or blank if the student has not yet canceled.
  * __is_udacity__: True if the account is a Udacity test account, False otherwise.
  * __is_canceled__: True if the student had canceled this enrollment at the time the data was collected, False otherwise.

#### Daily engagement

Data about engagement within Data Analyst Nanodegree courses for each student in
the enrollment table on each day they were enrolled. Includes a record even if
there was no engagement that day. Includes engagement data from both the
supporting courses for the Nanodegree program, and the corresponding freely
available courses with the same content.

##### Columns:
 * __acct__: A unique identifier for the account of the student whose engagement data this is.
 * __utc_date__: The date for which the data was collected.
 * __num_courses_visited__:  The total number of Data Analyst Nanodegree courses the student visited for at 2 minutes on this day. Nanodegree courses and freely available courses with the same content are counted separately.
 * __total_minutes_visited__: The total number of minutes the student spent taking Data Analyst Nanodegree courses on this day.
 * __lessons_completed__: The total number of lessons within Data Analyst Nanodegree courses on this day.
 * __projects_completed__: The total number of Data Analyst Nanodegree projects the student completed on this day.

#### Project submissions

Data about submissions for Data Analyst Nanodegree projects for each student in
the enrollment table.

##### Columns:
  * __creation_date__: The date the project was submitted.
  * __completion_date__: The date the project was evaluated.
  * __assigned_rating__: This column has 4 possible values:
    *  _blank_ - Project has not yet been evaluated.
    * _INCOMPLETE_ - Project did not meet specifications.
    * _PASSED_ - Project met specifications.
    * _DISTINCTION_ - Project exceeded specifications.
    *  _UNGRADED_ - The submission could not be evaluated (e.g. contained a corrupted file)
  * __account_key__: A unique identifier for the account of the student who submitted the project.
  * __lesson_key__: A unique identifier for the project that was submitted.
  * __processing_state__: This column has 2 possible values:
     * _CREATED_ - Project has been submitted but not evaluated.
     * _EVALUATED_ - Project has been evaluated.
