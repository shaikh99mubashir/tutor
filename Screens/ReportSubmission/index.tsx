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
import DateTimePicker from "@react-native-community/datetimepicker"
import moment from 'moment';

const ReportSubmission = ({navigation, route}: any) => {
  let data = route.params;


  const [value, setValue] = useState(new Date)
  const currentDate = new Date();
<<<<<<< HEAD
  const options: any = {day: 'numeric', month: 'long', year: 'numeric'};
  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  const [evaluation, setEvaluationReport] = useState<any>('');
  const [student, setStudent] = useState<any>('');
  const [subject, setSubject] = useState<any>('');
  const [knowledgeAnswer, setKnowledgeAnswer] = useState<any>('');
  const [understandingAnswer, setUnderstandingAnswer] = useState<any>('');
  const [analysisAnswer, setAnalysisAnswer] = useState<any>('');
  const [tutorId, setTutorId] = useState<any>('');
  const [studentData, setStudentData] = useState('');
  const [subjectData, setSubjectData] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<any>('');
  const [perQ1, setPerQ1] = useState('');
  const [perQ2, setPerQ2] = useState('');
  const [perQ3, setPerQ3] = useState('');
  const [perQ4, setPerQ4] = useState('');
  const [attQ1, setattQ1] = useState('');
  const [attQ2, setattQ2] = useState('');
  const [attQ3, setattQ3] = useState('');
  const [attQ4, setattQ4] = useState('');
  const [rulQ1, setRulQ1] = useState('');
  const [rulQ2, setRulQ2] = useState('');
  const [rulQ3, setRulQ3] = useState('');
  const [rulQ4, setRulQ4] = useState('');
  const context = useContext(StudentContext);
=======
  const options: any = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = value.toLocaleDateString('en-US', options);
  const [evaluation, setEvaluationReport] = useState<any>("")
  const [student, setStudent] = useState<any>("")
  const [subject, setSubject] = useState<any>("")
  const [knowledgeAnswer, setKnowledgeAnswer] = useState<any>("")
  const [understandingAnswer, setUnderstandingAnswer] = useState<any>("")
  const [analysisAnswer, setAnalysisAnswer] = useState<any>("")
  const [tutorId, setTutorId] = useState<any>("")
  const [studentData, setStudentData] = useState([])
  const [subjectData, setSubjectData] = useState([])
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
>>>>>>> 2609f7622b71d6b70ddc034fa65aa783f9bbc4d2

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
<<<<<<< HEAD
      option: 'Progress Report',
    },
    {
      option: 'Evaluation Report',
    },
=======
      option: 'Student Evaluation Report',
    },
    {
      option: 'Student Progress Report',
    },


>>>>>>> 2609f7622b71d6b70ddc034fa65aa783f9bbc4d2
  ];
  const Analysis = [
    {
      option: 'Poor - Able to solve different types of problems with guidance.',
    },
    {
      option:
        'Average - Able to solve different types of problems with some hint.',
    },
    {
      option: 'Good - Able to solve problems with different ways.',
    },
  ];
  const understanding = [
    {
      option: 'Poor - Able to explain/demonstrate facts with difficulty.',
    },
    {
      option: 'Average - Able to explain/demonstrate facts with some error.',
    },
    {
      option:
        'Good - Able to explain/demonstrate facts concisely with little error',
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
  const knowledge = [
    {
      option:
        'Poor - Able to recall basic facts after giving hints about the subject matter.',
    },
    {
      option: 'Average - Able to recall some basic facts independently.',
    },
    {
      option: 'Good - Able to recall basic facts with ease and little error.',
    },
  ];
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

  // console.log(data.classAttendedTime[0].class_schedule_id, "data")

<<<<<<< HEAD
  console.log(subject, 'dataaaaaaa');
  console.log(student.studentID);
  console.log(tutorId, 'tutor');
  console.log(evaluation, 'eval');

  const submitReport = () => {
    if (
      !tutorId ||
      !student.studentID ||
      !subject?.id ||
      !evaluation?.option ||
      !knowledgeAnswer?.option ||
      !understandingAnswer?.option ||
      !analysisAnswer?.option ||
      !questions.addationalAssessments ||
      !questions.plan
    ) {
      ToastAndroid.show('Required Fields are missing', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    let date = new Date();
=======



  useEffect(() => {

    if (data?.notificationType == "Submit Evaluation Report") {
      setEvaluationReport(
        { option: data.notificationType }
      )
      let student = studentData && studentData.length > 0 && studentData.filter((e: any, i: any) => {

        return e.option == data.studentName
      })

      let subject = subjectData && subjectData.length > 0 && subjectData.filter((e: any, i: number) => {
        return e.option == data.subjectName
      })

      student && student.length > 0 && setStudent(student[0])
      subject && subject.length > 0 && setSubject(subject[0])
    } else if (data?.notificationType == "Submit Progress Report") {

      setEvaluationReport(
        { option: data.notificationType }
      )
      let student = studentData && studentData.length > 0 && studentData.filter((e: any, i: any) => {

        return e.option == data.studentName
      })

      let subject = subjectData && subjectData.length > 0 && subjectData.filter((e: any, i: number) => {
        return e.option == data.subjectName
      })

      student && student.length > 0 && setStudent(student[0])
      subject && subject.length > 0 && setSubject(subject[0])

    } else {

      setEvaluationReport(
        { option: "Submit Evaluation Report" }
      )

      let student = studentData && studentData.length > 0 && studentData.filter((e: any, i: any) => {
        return e.option == data.studentName
      })
      let subject = subjectData && subjectData.length > 0 && subjectData.filter((e: any, i: number) => {
        return e.option == data.subjectName
      })

      student && student.length > 0 && setStudent(student[0])
      subject && subject.length > 0 && setSubject(subject[0])
    }


  }, [navigation, subjectData, studentData])


  const submitReport = () => {

    if (!tutorId || !student.studentID || !subject?.id || !evaluation?.option || !knowledgeAnswer?.option || !understandingAnswer?.option || !analysisAnswer?.option) {
      ToastAndroid.show("Required Fields are missing", ToastAndroid.SHORT)
      return
    }

    setLoading(true)
    let date = value
>>>>>>> 2609f7622b71d6b70ddc034fa65aa783f9bbc4d2

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 since month is zero-based
    const day = date.getDate().toString().padStart(2, '0');
<<<<<<< HEAD
    let formData = new FormData();

    formData.append('tutorID', tutorId);
    formData.append('scheduleID', data.class_schedule_id);
    formData.append('studentID', student.studentID);
    formData.append('subjectID', subject.id);
    formData.append('currentDate', year + '/' + month + '/' + day);
    formData.append('reportType', evaluation.option);
    formData.append('knowledge', knowledgeAnswer.option);
    formData.append('understanding', understandingAnswer.option);
    formData.append('analysis', analysisAnswer.option);
    formData.append('additionalAssisment', questions.addationalAssessments);
    formData.append('plan', questions.plan);

    console.log(formData, 'formDataa');

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
        console.log(error, 'errrors');
      });
  };
  console.log('evaluation Progress Report', evaluation.option);
  console.log('setSelectedMonth', selectedMonth);

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} color={Theme.black} />
    </View>
  ) : (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
=======

    console.log(date, day, month)

    let formData = new FormData()

    formData.append("tutorID", tutorId)
    formData.append("scheduleID", data.class_schedule_id)
    formData.append("studentID", student.studentID)
    formData.append("subjectID", subject.id)
    formData.append("currentDate", year + '/' + month + '/' + day)
    formData.append("reportType", evaluation.option)
    formData.append("knowledge", knowledgeAnswer.option)
    formData.append("understanding", understandingAnswer.option)
    formData.append("analysis", analysisAnswer.option)
    formData.append("additionalAssisment", questions.addationalAssessments)
    formData.append("plan", questions.plan)

    axios.post(`${Base_Uri}api/tutorFirstReport`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
      ToastAndroid.show("Report has been submitted successfully", ToastAndroid.SHORT)
      setLoading(false)
      navigation.navigate('BackToDashboard');
    }).catch((error) => {
      setLoading(false)
      ToastAndroid.show("Report submission unSuccessfull", ToastAndroid.SHORT)
      console.log(error, "errrors")
    })

  }



  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setValue(currentDate)
    setShow(false)

  };


  return (
    loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
      <ActivityIndicator size={"large"} color={Theme.black} />
    </View> : <View style={{ backgroundColor: Theme.white, height: '100%' }}>
>>>>>>> 2609f7622b71d6b70ddc034fa65aa783f9bbc4d2
      <Header title="Report Submission" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{paddingHorizontal: 15, marginBottom: 100}}>
          {/* Report Type */}
          <DropDownModalView
            title="Report Type"
            placeHolder="Select Report Type"
            selectedValue={setEvaluationReport}
            value={evaluation.option}
            option={EvalutionOption}
            modalHeading="Select Report Type"
          />
<<<<<<< HEAD
          {/* First Class Date && Month */}
          {evaluation.option == 'Progress Report' ? (
            <View style={{marginTop: 8}}>
              <DropDownModalView
                title="Month"
                placeHolder="Select Report Type"
                selectedValue={setSelectedMonth}
                option={months}
                modalHeading="Select Month"
              />
            </View>
          ) : (
            <View style={{marginTop: 8}}>
              <Text style={{fontSize: 12, fontWeight: 'bold', color: 'black'}}>
                First Class Date
              </Text>
              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderWidth: 1,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  borderColor: Theme.gray,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: Theme.gray,
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 14,
                  }}>
                  {formattedDate}
                </Text>
              </View>
            </View>
          )}

=======
          {/* First Class Date */}
          <View style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>
              First Class Date
            </Text>
            <TouchableOpacity
              onPress={() => setShow(true)}
              style={{
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderWidth: 1,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                borderColor: Theme.gray,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                }}>
                {formattedDate}
              </Text>
            </TouchableOpacity>
          </View>
>>>>>>> 2609f7622b71d6b70ddc034fa65aa783f9bbc4d2
          {/* Student */}

          <DropDownModalView
            title="Student"
            selectedValue={setStudent}
<<<<<<< HEAD
            placeHolder="Select Student"
=======
            placeHolder="Select Student.."
            value={student && Object.keys(student).length > 0 ? student.option : ""}
>>>>>>> 2609f7622b71d6b70ddc034fa65aa783f9bbc4d2
            option={studentData}
            modalHeading="Student"
          />
          {/* Subject */}
          <DropDownModalView
            title="Subject"
            placeHolder="Select Subject"
            selectedValue={setSubject}
            value={subject && Object.keys(subject).length > 0 ? subject.option : ""}
            option={subjectData}
            modalHeading="Subject"
          />

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
            <DropDownModalView
              title="1. Knowledge"
              selectedValue={setKnowledgeAnswer}
              subTitle="What can you tell us about the student's knowledge of this Subject"
              placeHolder="Select Answer"
              option={knowledge}
              modalHeading="Knowledge"
            />
          )}
          {/* Understanding && Attitude  */}
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
            <DropDownModalView
              title="2. Understanding"
              selectedValue={setUnderstandingAnswer}
              subTitle="What can you tell us about the student's Understanding of this Subject"
              placeHolder="Select Answer"
              option={understanding}
              modalHeading="Understanding"
            />
          )}
          {/* Analysis */}
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
            <DropDownModalView
              title="3. Analysis"
              selectedValue={setAnalysisAnswer}
              subTitle="What can you tell us about the student's ablity to apply analyse fact and theory of this Subject"
              placeHolder="Select Answer"
              option={Analysis}
              modalHeading="Analysis"
            />
          )}

          {evaluation.option == 'Progress Report' ? (
            <>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: 'black',
                  marginTop: 8,
                }}>
                4. Observation
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                }}>
                Did you (tutor) hold or carried out any form of eximination/test/quiz for student within this 3 months?
              </Text>
              <View
                style={[
                  styles.textAreaContainer,
                  {
                    width: '100%',
                    borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 5,
                  },
                ]}>
                <TextInput
                  placeholder="Enter answer"
                  multiline={true}
                  maxLength={300}
                  onChangeText={e => setQuestions({...questions, plan: e})}
                  style={[
                    styles.textArea,
                    {
                      height: 80,
                      padding: 8,
                      color: 'black',
                    },
                  ]}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="grey"
                />
              </View>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Poppins-SemiBold',
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
                    borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 5,
                  },
                ]}>
                <TextInput
                  placeholder="Enter answer"
                  multiline={true}
                  maxLength={300}
                  onChangeText={e => setQuestions({...questions, plan: e})}
                  style={[
                    styles.textArea,
                    {
                      height: 80,
                      padding: 8,
                      color: 'black',
                    },
                  ]}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="grey"
                />
              </View>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  marginTop: 8,
                }}>
                which topic(s) has the students showed some significant improvement?
              </Text>
              <View
                style={[
                  styles.textAreaContainer,
                  {
                    width: '100%',
                    borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 5,
                  },
                ]}>
                <TextInput
                  placeholder="Enter answer"
                  multiline={true}
                  maxLength={300}
                  onChangeText={e => setQuestions({...questions, plan: e})}
                  style={[
                    styles.textArea,
                    {
                      height: 80,
                      padding: 8,
                      color: 'black',
                    },
                  ]}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="grey"
                />
              </View>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  marginTop: 8,
                }}>
                Can you determine and name the topic(s) that the student should improve and focus on?
              </Text>
              <View
                style={[
                  styles.textAreaContainer,
                  {
                    width: '100%',
                    borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 5,
                  },
                ]}>
                <TextInput
                  placeholder="Enter answer"
                  multiline={true}
                  maxLength={300}
                  onChangeText={e => setQuestions({...questions, plan: e})}
                  style={[
                    styles.textArea,
                    {
                      height: 80,
                      padding: 8,
                      color: 'black',
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
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: 'black',
                  marginTop: 8,
                }}>
                4. Additional Assessment
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                }}>
                What is the current score for the subject?
              </Text>
              <View
                style={[
                  styles.textAreaContainer,
                  {
                    width: '100%',
                    borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 5,
                  },
                ]}>
                <TextInput
                  placeholder="Message"
                  multiline={true}
                  maxLength={300}
                  onChangeText={e =>
                    setQuestions({...questions, addationalAssessments: e})
                  }
                  style={[
                    styles.textArea,

                    {
                      width: Dimensions.get('window').width,
                      padding: 8,
                      color: 'black',
                    },
                  ]}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="grey"
                />
              </View>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  marginTop: 8,
                }}>
                Elaborate your Plan to Help Student?
              </Text>
              <View
                style={[
                  styles.textAreaContainer,
                  {
                    width: '100%',
                    borderWidth: 1,
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
            borderWidth: 1,
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
                fontFamily: 'Poppins-Regular',
              }}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={value}
            mode={"date"}
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
    borderWidth: 1,
    padding: 5,
  },
  textArea: {
    height: 120,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
});
