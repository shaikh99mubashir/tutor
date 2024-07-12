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
import React, { useState, useEffect, useContext } from 'react';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import DropDownModalView from '../../Component/DropDownModalView';
import Status from '../Status';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import StudentContext from '../../context/studentContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import CustomLoader from '../../Component/CustomLoader';

const ReportSubmission = ({ navigation, route }: any): any => {
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
  const options: any = { day: 'numeric', month: 'SHORT', year: 'numeric' };
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
  const [obQ1, setObQ1] = useState<any>('');
  const [obQ2, setObQ2] = useState<any>('');
  const [obQ3, setObQ3] = useState<any>('');
  const [obQ4, setObQ4] = useState<any>('');
  const [obQ5, setObQ5] = useState<any>('');
  const [obQ6, setObQ6] = useState<any>('');
  const [perQ1, setPerQ1] = useState<any>('');
  const [perQ2, setPerQ2] = useState<any>('');
  const [perQ3, setPerQ3] = useState<any>('');
  const [perQ4, setPerQ4] = useState<any>('');
  const [perQ5, setPerQ5] = useState<any>('');
  const [perQ6, setPerQ6] = useState<any>('');
  const [attQ1, setattQ1] = useState<any>('');
  const [attQ2, setattQ2] = useState<any>('');
  const [attQ3, setattQ3] = useState<any>('');
  const [attQ4, setattQ4] = useState<any>('');
  const [attQ5, setattQ5] = useState<any>('');
  const [attQ6, setattQ6] = useState<any>('');
  const [rulQ1, setRulQ1] = useState<any>('');
  const [rulQ2, setRulQ2] = useState<any>('');
  const [rulQ3, setRulQ3] = useState<any>('');
  const [rulQ4, setRulQ4] = useState<any>('');
  console.log('knowledgeAnswer', knowledgeAnswer);

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
      option: 'Strong understanding.',
    },
    {
      option: 'Basic understanding.',
    },
    {
      option: 'Little to no understanding.',
    },
  ];
  const performanceOption2 = [
    {
      option: 'Outstanding performance.',
    },
    {
      option: 'Adequate performance with room for improvement.',
    },
    {
      option: 'Consistently below expectations',
    },
  ];
  const performanceOption3 = [
    {
      option: 'Highly engaged, frequently asks questions.',
    },
    {
      option: 'Participates and occasionally asks questions.',
    },
    {
      option: 'Does not participate or ask questions.',
    },
  ];
  const performanceOption4 = [
    {
      option: 'Clear answers, in-depth explanations.',
    },
    {
      option: 'Adequate answers, basic explanations.',
    },
    {
      option: 'Unable to answer clearly, little to no explanations.',
    },
  ];
  const performanceOption5 = [
    {
      option: 'Significant improvement in many topics.',
    },
    {
      option: 'Some improvement in specific topic.',
    },
    {
      option: 'No noticeable improvement.',
    },
  ];
  const attitudeOption = [
    {
      option: 'Rarely absent, consistently on time.',
    },
    {
      option: 'Sometimes absent or late, but with reasonable excuses.',
    },
    {
      option: 'Regularly absent or late, significantly impacts participation.',
    },
  ];
  const attitudeOption2 = [
    {
      option: 'Communication is very effective and frequent.',
    },
    {
      option: 'Communication is adequate but could be more effective.',
    },
    {
      option: 'Communication is minimal or ineffective.',
    },
  ];
  const attitudeOption3 = [
    {
      option: 'Completes homework ahead of deadlines.',
    },
    {
      option: 'Completes most homework on time.',
    },
    {
      option: 'Rarely completes homework on time.',
    },
  ];
  const attitudeOption4 = [
    {
      option: 'Shows a strong willingness to learn.',
    },
    {
      option: 'Shows some interest and willingness to learn.',
    },
    {
      option: 'Rarely completes homework on time.Rarely shows willingness to learn.',
    },
  ];
  const attitudeOption5 = [
    {
      option: 'Highly engaged and interested.',
    },
    {
      option: 'Moderately engaged.',
    },
    {
      option: 'Lacks engagement and interest.',
    },
  ];
  const resultOption = [
    {
      option: 'Consistently achieves high scores.',
    },
    {
      option: 'Achieves average scores.',
    },
    {
      option: 'Consistently achieves low scores.',
    },
  ];
  const resultOption2 = [
    {
      option: 'Always well-prepared.',
    },
    {
      option: 'Adequately prepared.',
    },
    {
      option: 'Rarely prepared.',
    },
  ];
  const resultOption3 = [
    {
      option: 'Scores are consistently high.',
    },
    {
      option: ' Scores are average.',
    },
    {
      option: 'Scores are consistently low.',
    },
  ];
  const OB1 = [
    {
      option: 'Yes',
    },
    {
      option: 'No',
    },
  ];
  const OB2 = [
    {
      option: 'Visual: Learns with images and diagrams.',
    },
    {
      option: 'Auditory: Listening and verbal instruction.',
    },
    {
      option: 'Reading/Writing: Reading and writing notes.',
    },
    {
      option: 'Multimodal: Learns best with a combination of styles',
    },
  ];

  const context = useContext(StudentContext);

  const { students, subjects } = context;

  const getTutorId = async () => {
    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
    const data: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(data);
    let { tutorID } = loginData;
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
      option: ' Solves most questions correctly with little guidance.',
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
      option: 'Auditory: Listening and verbal instruction.',
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
      option:
        'Able to answer questions using many different methods and concepts. ',
    },
    {
      option: 'Able to use various methods and concepts, but not frequently. ',
    },
    {
      option:
        'Finds it hard to use different methods and concepts to answer questions.',
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
      option: ' Struggles to explain concepts and makes many mistakes.',
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
      option: ' Unable to apply concepts and solve problems correctly.',
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
      setEvaluationReport({ option: 'Evaluation Report' });
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
      setEvaluationReport({ option: 'Progress Report' });
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
      setEvaluationReport({ option: 'Evaluation Report' });

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
      console.log('data?.studentID', data?.studentID);
      console.log('data?.subjectID', data?.subjectID);
      console.log('selectedMonth', selectedMonth);

      if (
        !tutorId ||
        !data?.studentID ||
        !selectedMonth ||
        !obQ1 ||
        !obQ2 ||
        !obQ3 ||
        !obQ4 ||
        !obQ5 ||
        !obQ6 ||
        !perQ1 ||
        !perQ2 ||
        !perQ3 ||
        !perQ4 ||
        !perQ5 ||
        !attQ1 ||
        !attQ2 ||
        !attQ3 ||
        !attQ4 ||
        !attQ5 ||
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
        'observation',
        obQ1?.option,
      );
      formData.append(
        'observation2',
        obQ2?.option,
      );
      formData.append(
        'observation3',
        obQ3,
      );
      formData.append(
        'observation4',
        obQ4,
      );
      formData.append(
        'observation5',
        obQ5,
      );
      formData.append(
        'observation6',
        obQ6,
      );
      formData.append(
        'performance',
        perQ1?.option,
      );
      formData.append(
        'performance2',
        perQ2?.option,
      );
      formData.append(
        'performance3',
        perQ3?.option,
      );
      formData.append('performance4', perQ4?.option);
      formData.append('performance5', perQ5?.option);
      formData.append('performance6', perQ6);
      formData.append(
        'attitude',
        attQ1?.option,
      );
      formData.append(
        'attitude2',
        attQ2?.option,
      );
      formData.append(
        'attitude3',
        attQ3?.option,
      );
      formData.append(
        'attitude4',
        attQ4?.option,
      );
      formData.append(
        'attitude5',
        attQ5?.option,
      );
      formData.append(
        'attitude6',
        attQ6,
      );
      formData.append('result', rulQ1?.option);
      formData.append(
        'result2',
        rulQ2?.option,
      );
      formData.append(
        'result3',
        rulQ3?.option,
      );
      formData.append(
        'result4',
        rulQ4,
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

          setObQ1('')
          setObQ2('')
          setObQ3('')
          setObQ4('')
          setObQ5('')
          setObQ6('')
          setPerQ1('')
          setPerQ2('')
          setPerQ3('')
          setPerQ4('')
          setPerQ5('')
          setPerQ6('')
          setattQ1('')
          setattQ2('')
          setattQ3('')
          setattQ4('')
          setattQ5('')
          setattQ6('')
          setRulQ1('')
          setRulQ2('')
          setRulQ3('')
          setRulQ4('')


        })
        .catch(error => {
          setLoading(false);
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
          ToastAndroid.show('Failed To Submit Report', ToastAndroid.SHORT);
          console.log(error, 'error');
        });
      return;
    }
    // if(questions.addationalAssessments >= '10'){
    //   ToastAndroid.show('Please answer all questions', ToastAndroid.SHORT);
    //   return
    // }

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
        setKnowledgeAnswer('')
        setKnowledgeAnswer2('')
        setUnderstandingAnswer('')
        setUnderstandingAnswer2('')
        setCtAnswer('')
        setCtAnswer2('')
        setObservationEReport('')
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
  console.log("evaluation.option", evaluation.option);

  return (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <CustomLoader visible={loading} />
      <Header title={evaluation.option} navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15, marginBottom: 100 }}>
          {/* Report Type */}
          {/* <DropDownModalView
            title="Report Type"
            placeHolder="Evaluation Report"
            selectedValue={setEvaluationReport}
            value={evaluation.option}
            option={EvalutionOption}
            modalHeading="Select Report Type"
          /> */}
          {/* <View style={{ marginTop: 8 }}>
            <Text
              style={{
                fontSize: 16,
                color: 'black',
                fontFamily: 'Circular Std Bold',
              }}>
              Submit Report
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
                {evaluation.option}
              </Text>
            </View>
          </View> */}

          {/* First Class Date */}
          {evaluation.option == 'Progress Report' ? (
            <View style={{ marginTop: 8 }}>
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
            <View style={{ marginTop: 8 }}>
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
          <View style={{ marginTop: 8 }}>
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
          <View style={{ marginTop: 8 }}>
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
          {/* evaluation Knowledge /  Observation*/}
          {evaluation.option == 'Progress Report' ? (
            <>
              <DropDownModalView
                title="A. OBSERVATION"
                selectedValue={setObQ1}
                subTitle=" Did you (tutor) hold or carried out any form of examination/test/quiz for the student within this 3 months?"
                placeHolder="Select Answer"
                option={OB1}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setObQ2}
                subTitle="What is the student's learning style?"
                placeHolder="Select Answer"
                option={OB2}
                modalHeading="Select Answer"
              />
              <>
                <Text
                  style={{
                    color: Theme.gray,
                    fontFamily: 'Circular Std Medium',
                    fontSize: 14,
                    marginTop: 8,
                  }}>
                  What significant improvement do you see in the student's
                  performance compared to before?
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
                    placeholder="significant improvement"
                    multiline={true}
                    maxLength={300}
                    onChangeText={e => setObQ3(e)}
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
              <>
                <Text
                  style={{
                    color: Theme.gray,
                    fontFamily: 'Circular Std Medium',
                    fontSize: 14,
                    marginTop: 8,
                  }}>
                  Please suggest the parts that the student should improve and
                  focus on?
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
                    placeholder="student should focus on"
                    multiline={true}
                    maxLength={300}
                    onChangeText={e => setObQ4(e)}
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
              <>
                <Text
                  style={{
                    color: Theme.gray,
                    fontFamily: 'Circular Std Medium',
                    fontSize: 14,
                    marginTop: 8,
                  }}>
                  Please elaborate your plans for the student in 3 months' time
                  from now?
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
                    placeholder="plan"
                    multiline={true}
                    maxLength={300}
                    onChangeText={e => setObQ5(e)}
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
              <>
                <Text
                  style={{
                    color: Theme.gray,
                    fontFamily: 'Circular Std Medium',
                    fontSize: 14,
                    marginTop: 8,
                  }}>
                  Comment (Additional)
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
                    placeholder="Comment"
                    multiline={true}
                    maxLength={300}
                    onChangeText={e => setObQ6(e)}
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
                value={knowledgeAnswer?.option}
              />
              <DropDownModalView
                selectedValue={setKnowledgeAnswer2}
                subTitle="How well does the student share their ideas on the topics under discussion?"
                placeHolder="Select Answer"
                option={knowledge2}
                value={knowledgeAnswer2?.option}
                modalHeading="Knowledge"
              />
            </>
          )}
          {/* Performance */}
          {evaluation.option == 'Progress Report' ? (
            <>
              <DropDownModalView
                title="B. Performance"
                selectedValue={setPerQ1}
                subTitle="How well does the student understand this subject?"
                placeHolder="Select Answer"
                option={performanceOption}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setPerQ2}
                subTitle="How well the student’s performance during these 3 months ?"
                placeHolder="Select Answer"
                option={performanceOption2}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setPerQ3}
                subTitle="How well student’s participates in learning session?"
                placeHolder="Select Answer"
                option={performanceOption3}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setPerQ4}
                subTitle="How well student answers/explains/elaborates questions given by tutor?"
                placeHolder="Select Answer"
                option={performanceOption4}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setPerQ5}
                subTitle="How would you rate the student's level of improvement over the past month?"
                placeHolder="Select Answer"
                option={performanceOption5}
                modalHeading="Select Answer"
              />
              <>
                <Text
                  style={{
                    color: Theme.gray,
                    fontFamily: 'Circular Std Medium',
                    fontSize: 14,
                    marginTop: 8,
                  }}>
                  Comment (Additional)
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
                    placeholder="Comment"
                    multiline={true}
                    maxLength={300}
                    onChangeText={e => setPerQ6(e)}
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
            </>
          ) : (
            <>
              <DropDownModalView
                title="B. Performance"
                selectedValue={setUnderstandingAnswer}
                subTitle="How well does the student explain the basic concepts?"
                placeHolder="Select Answer"
                option={understanding}
                modalHeading="Understanding"
                value={understandingAnswer?.option}
              />
              <DropDownModalView
                selectedValue={setUnderstandingAnswer2}
                subTitle="How well does the student apply learned concepts to solve problems or answer questions?"
                placeHolder="Select Answer"
                option={understanding2}
                modalHeading="Understanding"
                value={understandingAnswer2?.option}
              />
            </>
          )}
          {/* CRITICAL THINKING */}
          {evaluation.option == 'Progress Report' ? (
            <>
              <DropDownModalView
                title="C. ATTITUDE"
                selectedValue={setattQ1}
                subTitle="How well student’s attendance for 3 months?"
                placeHolder="Select Answer"
                option={attitudeOption}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setattQ2}
                subTitle="How well do you interact/communicate with student during/after class?"
                placeHolder="Select Answer"
                option={attitudeOption2}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setattQ3}
                subTitle="How well the student manages their task given ? "
                placeHolder="Select Answer"
                option={attitudeOption3}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setattQ4}
                subTitle="How well student's willingness to learn ?"
                placeHolder="Select Answer"
                option={attitudeOption4}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setattQ5}
                subTitle="What are the student's interests towards the subject?"
                placeHolder="Select Answer"
                option={attitudeOption5}
                modalHeading="Select Answer"
              />
              <>
                <Text
                  style={{
                    color: Theme.gray,
                    fontFamily: 'Circular Std Medium',
                    fontSize: 14,
                    marginTop: 8,
                  }}>
                  Comment (Additional)
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
                    placeholder="Comment"
                    multiline={true}
                    maxLength={300}
                    onChangeText={e => setattQ6(e)}
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
                value={ctAnswer?.option}

              />
              <DropDownModalView
                selectedValue={setCtAnswer2}
                subTitle="How well is the is the student able to answer questions using a variety of methods and concepts?"
                placeHolder="Select Answer"
                option={CT2}
                modalHeading="Critical Thinking"
                value={ctAnswer2?.option}
              />
            </>
          )}

          {/*  OBSERVATION */}
          {evaluation.option == 'Progress Report' ? (
            <>
              <DropDownModalView
                title="D. RESULT"
                selectedValue={setRulQ1}
                subTitle=" How well does the student performance in quizzes/test?"
                placeHolder="Select Answer"
                option={resultOption}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setRulQ2}
                subTitle="How well the student prepares for test and assignment?"
                placeHolder="Select Answer"
                option={resultOption2}
                modalHeading="Select Answer"
              />
              <DropDownModalView
                selectedValue={setRulQ3}
                subTitle="How is the student’s test score at school?"
                placeHolder="Select Answer"
                option={resultOption3}
                modalHeading="Select Answer"
              />
              <>
                <Text
                  style={{
                    color: Theme.gray,
                    fontFamily: 'Circular Std Medium',
                    fontSize: 14,
                    marginTop: 8,
                  }}>
                  Comment (Additional)
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
                    placeholder="Comment"
                    multiline={true}
                    maxLength={300}
                    onChangeText={e => setRulQ4(e)}
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
            </>
          ) : (
            <>
              <DropDownModalView
                title="D. OBSERVATION"
                selectedValue={setObservationEReport}
                subTitle="How well does the student solve different types of questions with minimal guidance?"
                placeHolder="Select Answer"
                option={Observation}
                modalHeading="Observation"
                value={observationEReport?.option}
              />
            </>
          )}

          {evaluation.option == 'Progress Report' ? (
            <>
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
                  keyboardType="number-pad"
                  onChangeText={e =>
                    setQuestions({ ...questions, addationalAssessments: e })
                  }
                  style={{
                    color: 'black', fontSize: 16,
                    fontFamily: 'Circular Std Medium',
                  }}
                  value={questions?.addationalAssessments}
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
                  onChangeText={e => setQuestions({ ...questions, plan: e })}
                  style={[
                    styles.textArea,
                    {
                      height: 80,
                      padding: 8,
                      color: 'black',
                      fontFamily: 'Circular Std Medium',
                    },
                  ]}
                  value={questions.plan}
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
