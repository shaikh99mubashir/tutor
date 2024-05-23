import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Image,
  Modal,
  Button,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {Theme} from '../../constant/theme';
import Header from '../../Component/Header';
import DropDownModalView from '../../Component/DropDownModalView';
import Status from '../Status';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import StudentContext from '../../context/studentContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import CustomLoader from '../../Component/CustomLoader';

const ReportSubmission = ({navigation, route}: any): any => {
  let data = route.params;
  console.log('data', data);

  const [value, setValue]: any = useState();
  const date = new Date(value);
  const currentDate = new Date();
  const firstClass = new Date();
  // console.log("firstClass",formattedDateFirstClass);
  let formattedDateFirstClass: any = new Date(firstClass).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
  );
  const options: any = {day: 'numeric', month: 'SHORT', year: 'numeric'};
  // console.log("value", value);

  // const formattedDate = value.toLocaleDateString('en-US', options);
  let formattedDate: any = new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  // console.log('formattedDate',formattedDate);

  const [evaluation, setEvaluationReport] = useState<any>('');
  const [student, setStudent] = useState<any>('');
  const [subject, setSubject] = useState<any>('');
  const [knowledgeAnswer, setKnowledgeAnswer] = useState<any>('');
  const [knowledgeAnswer2, setKnowledgeAnswer2] = useState<any>('');
  const [understandingAnswer, setUnderstandingAnswer] = useState<any>('');
  const [understandingAnswer2, setUnderstandingAnswer2] = useState<any>('');
  const [ctAnswer, setCtAnswer] = useState<any>('');
  const [ctAnswer2, setCtAnswer2] = useState<any>('');
  const [observationEReport, setObservationEReport] = useState<any>('');
  const [tutorId, setTutorId] = useState<any>('');
  const [studentData, setStudentData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<any>('');
  const [perQ1, setPerQ1] = useState<any>('');
  const [perQ2, setPerQ2] = useState<any>('');
  const [perQ3, setPerQ3] = useState<any>('');
  const [perQ4, setPerQ4] = useState<any>('');
  const [attQ1, setattQ1] = useState<any>('');
  const [attQ2, setattQ2] = useState<any>('');
  const [attQ3, setattQ3] = useState<any>('');
  const [attQ4, setattQ4] = useState<any>('');
  const [rulQ1, setRulQ1] = useState<any>('');
  const [rulQ2, setRulQ2] = useState<any>('');
  const [rulQ3, setRulQ3] = useState<any>('');
  const [rulQ4, setRulQ4] = useState<any>('');
  const [observation, setObservation] = useState<any>({
    obv1: '',
    obv2: '',
    obv3: '',
    obv4: '',
  });
  const months = [
    {
      option: 'January',
    },
    {
      option: 'February',
    },
    {
      option: 'March',
    },
    {
      option: 'April',
    },
    {
      option: 'May',
    },
    {
      option: 'June',
    },
    {
      option: 'July',
    },
    {
      option: 'August',
    },
    {
      option: 'September',
    },
    {
      option: 'October',
    },
    {
      option: 'November',
    },
    {
      option: 'December',
    },
  ];
  const performanceOption = [
    {
      option: 'Excellent',
    },
    {
      option: 'Good',
    },
    {
      option: 'Satisfactory',
    },
    {
      option: 'Average',
    },
  ];

  const context = useContext(StudentContext);

  const {students, subjects} = context;

  const getTutorId = async () => {
    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
    const data: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(data);
    let {tutorID} = loginData;
    setTutorId(tutorID);
  };

  const getSubject = () => {
    let mySubject =
      subjects &&
      subjects.length > 0 &&
      subjects.map((e: any, i: Number) => {
        if (e.subject) {
          return {
            option: e.subject,
            id: e.id,
          };
        }
      });

    setSubjectData(mySubject);
  };

  const getStudents = async () => {
    let myStudents =
      students &&
      students.length > 0 &&
      students.map((e: any, i: Number) => {
        if (e?.studentName) {
          return {
            ...e,
            option: e?.studentName,
          };
        }
      });
    setStudentData(myStudents);
  };

  useEffect(() => {
    if (subjects) {
      getSubject();
      getStudents();
    }
  }, [subjects]);
  useEffect(() => {
    getTutorId();
  }, []);

  const [questions, setQuestions] = useState({
    reportType: '',
    date: currentDate.toISOString().slice(0, 10),
    student: '',
    knowledge: '',
    understanding: '',
    analysis: '',
    addationalAssessments: '',
    plan: '',
  });
  const EvalutionOption = [
    {
      option: 'Evaluation Report',
    },
    {
      option: 'Progress Report',
    },
  ];
  const CT = [
    {
      option: 'Solves many different questions correctly on their own.',
    },
    {
      option:
        ' Solves most questions correctly with little guidance.',
    },
    {
      option: 'Answers some questions correctly but needs a lot of guidance.',
    },
  ];
  const Observation = [
    {
      option: 'Visual: Learns with images and diagrams.',
    },
    {
      option:
        'Auditory: Listening and verbal instruction.',
    },
    {
      option: 'Reading/Writing: Reading and writing notes.',
    },
    {
      option: 'Multimodal: Learns best with a combination of styles.',
    },
  ];
  const CT2 = [
    {
      option: 'Able to answer questions using many different methods and concepts. ',
    },
    {
      option:
        'Able to use various methods and concepts, but not frequently. ',
    },
    {
      option: 'Finds it hard to use different methods and concepts to answer questions.'
      ,
    },
  ];
  const understanding = [
    {
      option: 'Explains concepts clearly and accurately.',
    },
    {
      option: 'Explains basic concepts clearly but with a few errors.',
    },
    {
      option:
        ' Struggles to explain concepts and makes many mistakes.',
    },
  ];
  const understanding2 = [
    {
      option: 'Applies concepts well and solves most problems correctly.',
    },
    {
      option: 'Applies concepts well and solves certain questions correctly.',
    },
    {
      option:
        ' Unable to apply concepts and solve problems correctly.',
    },
  ];
  const knowledge = [
    {
      option: ' Remember most concepts with minimal errors.',
    },
    {
      option: 'Remember basic concepts after receiving guidance. ',
    },
    {
      option: 'Struggles to remember concepts without a lot of help.',
    },
  ];
  const knowledge2 = [
    {
      option: 'Able to share their ideas clearly and actively.',
    },
    {
      option: 'Shares ideas after receiving guidance. ',
    },
    {
      option:
        'Struggles to put ideas into words and rarely expresses thoughts.',
    },
  ];

  // console.log(data.classAttendedTime[0].class_schedule_id, "data")

  useEffect(() => {
    if (data?.notificationType == 'Submit Evaluation Report') {
      setEvaluationReport({option: data.notificationType});
      let student =
        studentData &&
        studentData.length > 0 &&
        studentData.filter((e: any, i: any) => {
          return e.option == data.studentName;
        });

      let subject =
        subjectData &&
        subjectData.length > 0 &&
        subjectData.filter((e: any, i: number) => {
          return e.option == data.subjectName;
        });

      student && student.length > 0 && setStudent(student[0]);
      subject && subject.length > 0 && setSubject(subject[0]);
    } else if (data?.notificationType == 'Submit Progress Report') {
      setEvaluationReport({option: 'Progress Report'});
      let student =
        studentData &&
        studentData.length > 0 &&
        studentData.filter((e: any, i: any) => {
          return e.option == data.studentName;
        });

      let subject =
        subjectData &&
        subjectData.length > 0 &&
        subjectData.filter((e: any, i: number) => {
          return e.option == data.subjectName;
        });

      student && student.length > 0 && setStudent(student[0]);
      subject && subject.length > 0 && setSubject(subject[0]);
      setSelectedMonth(months[new Date().getMonth()]);
    } else {
      setEvaluationReport({option: 'Submit Evaluation Report'});

      let student =
        studentData &&
        studentData.length > 0 &&
        studentData.filter((e: any, i: any) => {
          return e.option == data.studentName;
        });
      let subject =
        subjectData &&
        subjectData.length > 0 &&
        subjectData.filter((e: any, i: number) => {
          return e.option == data.subjectName;
        });

      student && student.length > 0 && setStudent(student[0]);
      subject && subject.length > 0 && setSubject(subject[0]);
    }
  }, [navigation, subjectData, studentData]);
  console.log(data?.class_schedule_id, 'data.class_schedule_id');

  const submitReport = () => {
    if (evaluation.option == 'Progress Report') {
      console.log('tutorId', tutorId);
      console.log('student.studentID', student.studentID);
      console.log('selectedMonth', selectedMonth);

      if (
        !tutorId ||
        !data?.studentID ||
        !selectedMonth ||
        !perQ1 ||
        !perQ2 ||
        !perQ3 ||
        !perQ4 ||
        !attQ1 ||
        !attQ2 ||
        !attQ3 ||
        !attQ4 ||
        !rulQ1 ||
        !rulQ2 ||
        !rulQ3 ||
        !rulQ4
      ) {
        ToastAndroid.show('Required Fields are missing', ToastAndroid.SHORT);
        return;
      }

      setLoading(true);

      let formData = new FormData();

      formData.append('tutorID', tutorId);
      formData.append('studentID', data?.studentID);
      formData.append('subjectID', data?.subjectID);
      formData.append('reportType', evaluation?.option);
      formData.append('month', selectedMonth?.option);
      formData.append(
        'rate_student_understanding_on_this_subject',
        perQ1?.option,
      );
      formData.append(
        'how_is_the_student_performance_on_homework',
        perQ2?.option,
      );
      formData.append(
        'how_well_student_participates_in_learning_session',
        perQ3?.option,
      );
      formData.append('how_well_student_answers', perQ4?.option);
      formData.append(
        'how_you_can_rate_student_attendance_for_3_months',
        attQ1?.option,
      );
      formData.append(
        'how_well_do_you_interact_with_studyent_during_class',
        attQ2?.option,
      );
      formData.append(
        'how_well_the_student_manages_his_time_tomplete_his_homework',
        attQ3?.option,
      );
      formData.append(
        'how_well_the_student_respondes_when_corrected',
        attQ4?.option,
      );
      formData.append('rate_the_student_performance_in_quizzes', rulQ1?.option);
      formData.append(
        'how_well_the_student_prepares_for_test_and_assignment',
        rulQ2?.option,
      );
      formData.append(
        'rate_student_learning_preferences_willingness_to_learn_and_inter',
        rulQ4?.option,
      );
      formData.append(
        'did_you_hold_or_carried_out_any_form_of_examination_for_the_stud',
        rulQ4?.option,
      );
      formData.append(
        'how_do_you_rate_student_performance_based_on_this_test',
        observation?.obv1,
      );
      formData.append(
        'which_topic_has_the_student_showed_some_significant_improvement',
        observation?.obv2,
      );
      formData.append(
        'can_you_determine_and_name_the_topic_that_the_student_should_imp',
        observation?.obv3,
      );
      formData.append(
        'please_elaborate_your_plan_for_the_student_in_3_months_time_from',
        observation?.obv4,
      );
      console.log('form data progress report===========>', formData);

      axios
        .post(`${Base_Uri}api/progressReport`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          setLoading(false);
          ToastAndroid.show(res?.data?.successMessage, ToastAndroid.SHORT);
          navigation.navigate('BackToDashboard', data);
        })
        .catch(error => {
          setLoading(false);
          ToastAndroid.show('Failed To Submit Report', ToastAndroid.SHORT);
          console.log(error, 'error');
        });
      return;
    }

    if (
      !tutorId ||
      !data.studentID ||
      !data.subjectID ||
      !evaluation?.option ||
      !knowledgeAnswer?.option ||
      !knowledgeAnswer2?.option ||
      !understandingAnswer?.option ||
      !understandingAnswer2?.option ||
      !ctAnswer?.option ||
      !ctAnswer2?.option ||
      !observationEReport?.option
    ) {
      ToastAndroid.show('Required Fields are missing', ToastAndroid.SHORT);
      return;
    }
    setLoading(true);
    let date = value;
    let formData = new FormData();

    formData.append('tutorID', tutorId);
    formData.append('scheduleID', data?.class_schedule_id);
    formData.append('studentID', data?.studentID);
    formData.append('subjectID', data?.subjectID);
    // formData.append("currentDate", year + '/' + month + '/' + day)
    formData.append('currentDate', formattedDateFirstClass);
    formData.append('reportType', evaluation?.option);
    formData.append('knowledge', knowledgeAnswer?.option);
    formData.append('knowledge2', knowledgeAnswer2?.option);
    formData.append('understanding', understandingAnswer?.option);
    formData.append('understanding2', understandingAnswer2?.option);
    formData.append('criticalThinking', ctAnswer?.option);
    formData.append('criticalThinking2', ctAnswer2?.option);
    formData.append('observation', observationEReport?.option);
    formData.append('additionalAssisment', questions?.addationalAssessments);
    formData.append('plan', questions?.plan);

    axios
      .post(`${Base_Uri}api/tutorFirstReport`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        ToastAndroid.show(
          'Report has been submitted successfully',
          ToastAndroid.SHORT,
        );
        setLoading(false);
        navigation.navigate('BackToDashboard');
      })
      .catch(error => {
        setLoading(false);
        ToastAndroid.show(
          'Report submission unSuccessfull',
          ToastAndroid.SHORT,
        );
        if (error.response) {
          // The request was made and the server responded with a status code
          console.log('Server responded with data:', error.response.data);
          console.log('Status code:', error.response.status);
          console.log('Headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('No response received:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error setting up the request:', error.message);
        }
      });
  };

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setValue(currentDate);
    setShow(false);
  };

  return (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <CustomLoader visible={loading} />
      <Header title="Report Submission" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{paddingHorizontal: 15, marginBottom: 100}}>
          {/* Report Type */}
          <DropDownModalView
            title="Report Type"
            placeHolder="Evaluation Report"
            selectedValue={setEvaluationReport}
            value={evaluation.option}
            option={EvalutionOption}
            modalHeading="Select Report Type"
          />
          {/* First Class Date */}
          {evaluation.option == 'Progress Report' ? (
            <View style={{marginTop: 8}}>
              <DropDownModalView
                title="Month"
                placeHolder="Select Report Type"
                selectedValue={setSelectedMonth}
                value={selectedMonth.option}
                option={months}
                modalHeading="Select Month"
              />
            </View>
          ) : (
            <View style={{marginTop: 8}}>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontFamily: 'Circular Std Bold',
                }}>
                First Class Date
              </Text>
              <View
                // onPress={() => setShow(true)}
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // borderWidth: 1,
                  // borderTopLeftRadius: 5,
                  // borderTopRightRadius: 5,
                  // borderBottomLeftRadius: 5,
                  // borderBottomRightRadius: 5,
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                  borderRadius: 15,
                  backgroundColor: Theme.liteBlue,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: Theme.black,
                    fontFamily: 'Circular Std Medium',
                    fontSize: 16,
                  }}>
                  {formattedDateFirstClass}
                </Text>
              </View>
            </View>
          )}
          {/* Student */}
          {/* <DropDownModalView
            title="Student"
            selectedValue={setStudent}
            placeHolder="Select Student.."
            value={student && Object.keys(student).length > 0 ? student.option : ""}
            option={studentData}
            modalHeading="Student"
          /> */}
          <View style={{marginTop: 8}}>
            <Text
              style={{
                fontSize: 16,
                color: 'black',
                fontFamily: 'Circular Std Bold',
              }}>
              Student
            </Text>
            <View
              // onPress={() => setShow(true)}
              style={{
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 15,
                paddingHorizontal: 15,
                borderRadius: 15,
                backgroundColor: Theme.liteBlue,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: Theme.black,
                  fontFamily: 'Circular Std Medium',
                  fontSize: 16,
                }}>
                {data?.studentName}
              </Text>
            </View>
          </View>
          {/* Subject */}
          {/* <DropDownModalView
            title="Subject"
            placeHolder="Select Subject"
            selectedValue={setSubject}
            value={subject && Object.keys(subject).length > 0 ? subject.option : ""}
            option={subjectData}
            modalHeading="Subject"
          /> */}
          <View style={{marginTop: 8}}>
            <Text
              style={{
                fontSize: 16,
                color: 'black',
                fontFamily: 'Circular Std Bold',
              }}>
              Subject
            </Text>
            <View
              // onPress={() => setShow(true)}
              style={{
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 15,
                paddingHorizontal: 15,
                borderRadius: 15,
                backgroundColor: Theme.liteBlue,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: Theme.black,
                  fontFamily: 'Circular Std Medium',
                  fontSize: 16,
                }}>
                {data?.subjectName}
              </Text>
            </View>
          </View>
          {/* Knowledge */}
          {evaluation.option == 'Progress Report' ? (
            <>
              <DropDownModalView
                title="1. Performance"
                selectedValue={setPerQ1}
                subTitle="Rate the student's understanding of this subject."
                placeHolder="Select Answer"
                option={performanceOption}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setPerQ2}
                subTitle="How is student performance on homework?"
                placeHolder="Select Answer"
                option={performanceOption}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setPerQ3}
                subTitle="How well student's participate in learning session?"
                placeHolder="Select Answer"
                option={performanceOption}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setPerQ4}
                subTitle="How well student's answer/explain/eleborates questions givenby tutor?"
                placeHolder="Select Answer"
                option={performanceOption}
                modalHeading="Select Answer"
              />
            </>
          ) : (
            <>
              <DropDownModalView
                title="A. Knowledge"
                selectedValue={setKnowledgeAnswer}
                subTitle="How well does the student recall basic concepts?"
                placeHolder="Select Answer"
                option={knowledge}
                modalHeading="Knowledge"
              />
              <DropDownModalView
                selectedValue={setKnowledgeAnswer2}
                subTitle="How well does the student share their ideas on the topics under discussion?"
                placeHolder="Select Answer"
                option={knowledge2}
                modalHeading="Knowledge"
              />
            </>
          )}
          {/* Understanding */}
          {evaluation.option == 'Progress Report' ? (
            <>
              <DropDownModalView
                title="2. Attitude"
                selectedValue={setattQ1}
                subTitle="How can you rate the student attendence for 3 months?"
                placeHolder="Select Answer"
                option={performanceOption}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setattQ2}
                subTitle="How well do you intrect/communicate with student during/after class?"
                placeHolder="Select Answer"
                option={performanceOption}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setattQ3}
                subTitle="How well the student manage his/her time to complete his/her homework?"
                placeHolder="Select Answer"
                option={performanceOption}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setattQ4}
                subTitle="How well the student response were corrected?"
                placeHolder="Select Answer"
                option={performanceOption}
                modalHeading="Select Answer"
              />
            </>
          ) : (
            <>
              <DropDownModalView
                title="B. Understanding"
                selectedValue={setUnderstandingAnswer}
                subTitle="How well does the student explain the basic concepts?"
                placeHolder="Select Answer"
                option={understanding}
                modalHeading="Understanding"
              />
              <DropDownModalView
                selectedValue={setUnderstandingAnswer2}
                subTitle="How well does the student apply learned concepts to solve problems or answer questions?"
                placeHolder="Select Answer"
                option={understanding2}
                modalHeading="Understanding"
              />
            </>
          )}
          {/* CRITICAL THINKING */}
          {evaluation.option == 'Progress Report' ? (
            <>
              <DropDownModalView
                title="3. Result"
                selectedValue={setRulQ1}
                subTitle="Rate the student's performance in the quizes"
                placeHolder="Select Answer"
                option={performanceOption}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setRulQ2}
                subTitle="How well the student prepare for the test and assignment?"
                placeHolder="Select Answer"
                option={performanceOption}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setRulQ3}
                subTitle="How student's test score at school?"
                placeHolder="Select Answer"
                option={performanceOption}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setRulQ4}
                subTitle="How student's learning prefrences, willingness to learn, and interest towords the subject?"
                placeHolder="Select Answer"
                option={performanceOption}
                modalHeading="Select Answer"
              />
            </>
          ) : (
            <>
            <DropDownModalView
              title="C. CRITICAL THINKING"
              selectedValue={setCtAnswer}
              subTitle="How well does the student solve different types of questions with minimal guidance?"
              placeHolder="Select Answer"
              option={CT}
              modalHeading="Critical Thinking"
              />
            <DropDownModalView
              selectedValue={setCtAnswer2}
              subTitle="How well is the is the student able to answer questions using a variety of methods and concepts?"
              placeHolder="Select Answer"
              option={CT2}
              modalHeading="Critical Thinking"
              />
             
              </>
          )}

           {/*  OBSERVATION */}
           {evaluation.option == 'Progress Report' ? (
           <></>
          ) : (
            <>
            <DropDownModalView
              title="D. OBSERVATION"
              selectedValue={setObservationEReport}
              subTitle="How well does the student solve different types of questions with minimal guidance?"
              placeHolder="Select Answer"
              option={Observation}
              modalHeading="Observation"
              />
             
              </>
          )}

          {evaluation.option == 'Progress Report' ? (
            <>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontFamily: 'Circular Std Bold',
                }}>
                4. Observation
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Circular Std Medium',
                  fontSize: 14,
                }}>
                Did you (tutor) hold or carried out any form of
                eximination/test/quiz for student within this 3 months?
              </Text>
              <View
                style={[
                  styles.textAreaContainer,
                  {
                    width: '100%',
                    // borderWidth: 1,
                    borderRadius: 15,
                    marginTop: 5,
                  },
                ]}>
                <TextInput
                  placeholder="Enter answer"
                  multiline={true}
                  maxLength={300}
                  onChangeText={e => setObservation({...observation, obv1: e})}
                  style={[
                    styles.textArea,
                    {
                      height: 80,
                      padding: 8,
                      color: 'black',
                      fontFamily: 'Circular Std Medium',
                    },
                  ]}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="grey"
                />
              </View>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Circular Std Medium',
                  fontSize: 14,
                  marginTop: 8,
                }}>
                How do you rate student's performance based on this test?
              </Text>
              <View
                style={[
                  styles.textAreaContainer,
                  {
                    width: '100%',
                    // borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 5,
                  },
                ]}>
                <TextInput
                  placeholder="Enter answer"
                  multiline={true}
                  maxLength={300}
                  onChangeText={e => setObservation({...observation, obv2: e})}
                  style={[
                    styles.textArea,
                    {
                      height: 80,
                      padding: 8,
                      color: 'black',
                      fontFamily: 'Circular Std Medium',
                    },
                  ]}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="grey"
                />
              </View>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Circular Std Medium',
                  fontSize: 14,
                  marginTop: 8,
                }}>
                which topic(s) has the students showed some significant
                improvement?
              </Text>
              <View
                style={[
                  styles.textAreaContainer,
                  {
                    width: '100%',
                    // borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 5,
                  },
                ]}>
                <TextInput
                  placeholder="Enter answer"
                  multiline={true}
                  maxLength={300}
                  onChangeText={e => setObservation({...observation, obv3: e})}
                  style={[
                    styles.textArea,
                    {
                      height: 80,
                      padding: 8,
                      color: 'black',
                      fontFamily: 'Circular Std Medium',
                    },
                  ]}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="grey"
                />
              </View>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Circular Std Medium',
                  fontSize: 14,
                  marginTop: 8,
                }}>
                Can you determine and name the topic(s) that the student should
                improve and focus on?
              </Text>
              <View
                style={[
                  styles.textAreaContainer,
                  {
                    width: '100%',
                    // borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 5,
                  },
                ]}>
                <TextInput
                  placeholder="Enter answer"
                  multiline={true}
                  maxLength={300}
                  onChangeText={e => setObservation({...observation, obv4: e})}
                  style={[
                    styles.textArea,
                    {
                      height: 80,
                      padding: 8,
                      color: 'black',
                      fontFamily: 'Circular Std Medium',
                    },
                  ]}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="grey"
                />
              </View>
            </>
          ) : (
            <>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'black',
                  marginTop: 8,
                  fontFamily: 'Circular Std Medium',
                }}>
                E. ADDITIONAL ASSESSMENT
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Circular Std Medium',
                  fontSize: 14,
                }}>
                What is the current score for the first assessement? [SCORE]/10
              </Text>
              <View
                style={[
                  styles.textAreaContainer,
                  {
                    width: '100%',
                    // borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 5,
                  },
                ]}>
                <TextInput
                  placeholder="give score out of 10"
                  keyboardType='number-pad'
                  onChangeText={e =>
                    setQuestions({...questions, addationalAssessments: e})
                  }
                  // style={[
                  //   styles.textArea,
                  //   {
                  //     width: Dimensions.get('window').width,
                  //     padding: 8,
                  //     color: 'black',
                  //     fontFamily: 'Circular Std Medium',
                  //   },
                  // ]}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="grey"
                />
              </View>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Circular Std Medium',
                  fontSize: 14,
                  marginTop: 8,
                }}>
                Describe your tutoring plan to help the students.
              </Text>
              <View
                style={[
                  styles.textAreaContainer,
                  {
                    width: '100%',
                    // borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 5,
                  },
                ]}>
                <TextInput
                  placeholder="Plan"
                  multiline={true}
                  maxLength={300}
                  onChangeText={e => setQuestions({...questions, plan: e})}
                  style={[
                    styles.textArea,
                    {
                      height: 80,
                      padding: 8,
                      color: 'black',
                      fontFamily: 'Circular Std Medium',
                    },
                  ]}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="grey"
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
      {/* Submit Button */}
      <View
        style={{
          backgroundColor: Theme.white,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          alignItems: 'center',
          elevation: 5,
        }}>
        <View
          style={{
            // borderWidth: 1,
            borderColor: Theme.white,
            marginVertical: 20,
            width: '94%',
          }}>
          <TouchableOpacity
            onPress={() => submitReport()}
            style={{
              alignItems: 'center',
              padding: 10,
              backgroundColor: Theme.darkGray,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontFamily: 'Circular Std Medium',
              }}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={value}
            mode={'date'}
            is24Hour={false}
            onChange={onChange}
          />
        )}
      </View>
    </View>
  );
};

export default ReportSubmission;

const styles = StyleSheet.create({
  textAreaContainer: {
    // borderWidth: 1,
    backgroundColor: Theme.lightGray,
    padding: 10,
  },
  textArea: {
    height: 120,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
});
