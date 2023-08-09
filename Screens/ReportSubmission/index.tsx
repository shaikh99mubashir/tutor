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
import DateTimePicker from "@react-native-community/datetimepicker"
import moment from 'moment';

const ReportSubmission = ({ navigation, route }: any) => {

  let data = route.params


  const [value, setValue] = useState(new Date)
  const currentDate = new Date();
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



  const context = useContext(StudentContext)

  const { students, subjects } = context

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
            option: e?.studentName
          };
        }
      });
    setStudentData(myStudents);
  };

  useEffect(() => {
    if (subjects) {
      getSubject();
      getStudents()
    }
  }, [subjects]);
  useEffect(() => {
    getTutorId()
  }, [])


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
      option: 'Student Evaluation Report',
    },
    {
      option: 'Student Progress Report',
    },


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
  ]

  // console.log(data.classAttendedTime[0].class_schedule_id, "data")




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

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 since month is zero-based
    const day = date.getDate().toString().padStart(2, '0');

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
      <Header title="Report Submission" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15, marginBottom: 100 }}>
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
          {/* Student */}
          <DropDownModalView
            title="Student"
            selectedValue={setStudent}
            placeHolder="Select Student.."
            value={student && Object.keys(student).length > 0 ? student.option : ""}
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
          <DropDownModalView
            title="1. Knowledge"
            selectedValue={setKnowledgeAnswer}
            subTitle="What can you tell us about the student's knowledge of this Subject"
            placeHolder="Select Answer"
            option={knowledge}
            modalHeading="Knowledge"
          />
          {/* Understanding */}
          <DropDownModalView
            title="2. Understanding"
            selectedValue={setUnderstandingAnswer}
            subTitle="What can you tell us about the student's Understanding of this Subject"
            placeHolder="Select Answer"
            option={understanding}
            modalHeading="Understanding"
          />
          {/* Analysis */}
          <DropDownModalView
            title="3. Analysis"
            selectedValue={setAnalysisAnswer}
            subTitle="What can you tell us about the student's ablity to apply analyse fact and theory of this Subject"
            placeHolder="Select Answer"
            option={Analysis}
            modalHeading="Analysis"
          />

          <Text
            style={{
              fontSize: 14,
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
              fontSize: 16,
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
              onChangeText={(e) => setQuestions({ ...questions, addationalAssessments: e })}
              style={[
                styles.textArea,

                {
                  width: Dimensions.get('window').width,
                  padding: 8,
                  color: "black"
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
              fontSize: 16,
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
              onChangeText={(e) => setQuestions({ ...questions, plan: e })}
              style={[
                styles.textArea,
                {
                  height: 80,
                  padding: 8,
                  color: "black"
                },
              ]}
              underlineColorAndroid="transparent"
              placeholderTextColor="grey"
            />
          </View>
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
                fontSize: 18,
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
