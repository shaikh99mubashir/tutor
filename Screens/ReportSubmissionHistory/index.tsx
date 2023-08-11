import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  RefreshControl,
  NativeModules
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Pdf from 'react-native-pdf';


const ReportSubmissionHistory = ({ navigation }: any) => {
  const [reportSubmission, setreportSubmission] = useState([]);
  const [progressReport, setProgressReport] = useState([])
  const [foundName, setFoundName] = useState([]);
  const [loading, setLoading] = useState(false)
  const [pdfUri, setPdfUri] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [refresh, setRefresh] = useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setRefresh(!refresh)
    }, 2000);
  }, [refresh]);


  const getReportSubmissionHistory = async () => {

    setLoading(true)

    let data: any = await AsyncStorage.getItem('loginAuth');

    data = JSON.parse(data);

    let { tutorID } = data;

    axios.get(`${Base_Uri}api/tutorFirstReportListing/${tutorID}`).then(({ data }) => {
      let { tutorReportListing } = data
      setreportSubmission(tutorReportListing)
      setLoading(false)
    }).catch((error) => {
      setLoading(false)
      console.log("error")
    })
  }

  const getProgressReportHistory = async () => {

    setLoading(true)

    let data: any = await AsyncStorage.getItem('loginAuth');

    data = JSON.parse(data);

    let { tutorID } = data;

    axios.get(`${Base_Uri}api/progressReportListing`).then(({ data }) => {
      let { progressReportListing } = data

      let tutorReport = progressReportListing && progressReportListing.length > 0 && progressReportListing.filter((e: any, i: number) => {
        return e.tutorID == tutorID
      })

      console.log(tutorReport, "reoirt")
      setProgressReport(tutorReport && tutorReport.length > 0 ? tutorReport : [])
      setLoading(false)
    }).catch((error) => {
      setLoading(false)
      console.log("error")
    })
  }



  useEffect(() => {

    getReportSubmissionHistory()
    getProgressReportHistory()

  }, [refresh])




  let allReports = [...reportSubmission, ...progressReport]




  const [searchText, setSearchText] = useState('');
  const searchStudent = (e: any) => {

    setSearchText(e);
    let filteredItems: any = allReports.filter((x: any) => {
      if (x?.studentID?.toString().toLowerCase().includes(e?.toLowerCase())) {
        return e
      }
    }

    );
    setFoundName(filteredItems);
  };


  const generateAndDownalodPdf = async (item: any): Promise<string | undefined> => {

    console.log(item, "items")

    try {
      const options = {
        html: `        <html>
        <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
          }
        </style>
      </head>
        <body>
        <div>
        <div>
       
        <div style="display: flex; justify-content: space-between;">
          <div style="display: flex; flex-direction: column; width: 45%">
            <img src="./logo.png" alt="logo" style="width: 70px" />
            <p style="color: blue";margin-top: 20px;>Sifu Edu & Learning Sdn Bhd (1270698-W)</p>
            <p style="margin-top: 5px;">1-1F, Jalan Setia Perdana BE U13/BE Setia Alam, Shah Alam, 40170,
              Selangor Tel: 603-5888 4827</p>
          </div>
          <div style="display: flex; flex-direction: column; width: 50%">
            <span
              style="font-size: 25px; background-color: orangered;
               color: white; padding: 8px; white-space: pre; font-weight: 700;margin-top: 20px;"
              >${item.tutorReportType}</span>
          </div>
        </div>
        
        <div style="display: flex; align-items: center;gap: 10px;">
        <h3 style="background-color: orangered; padding: 10px;margin-right: 5px;color: white;width:80px;">Student</h3>
        <h3 style='white-space: pre;'>${item.studentName}</h3>
      </div>
        <div style="display: flex; flex-direction: row;gap:10px;">
          <div style="display: flex; align-items: center;gap:5px;">
            <h3 style="background-color: orangered; padding: 10px;margin-right: 5px;color: white;width:80px;">Tutor</h3>
            <h3 style='white-space: pre;'>${item.tutorName}</h3>
          </div>
          <div style="display: flex; align-items: center;gap:5px;">
            <h3 style="background-color: orangered; padding: 10px;margin-right: 5px;color: white;width:80px;">Subject</h3>
            <h3 style='white-space: pre;'>${item.subjectName}</h3>
          </div>
          <div style="display: flex; align-items: center;gap:5px;">
            <h3 style="background-color: orangered; padding: 10px;margin-right: 5px;color: white;width:80px;">Month</h3>
            <h3 style='white-space: pre;'>${item.month}</h3>
          </div>
        </div>
      </div>

      <div>
      <p style="background-color: orangered;color: white;font-weight: 700;padding: 5px; margin: 0px;">A. KNOWLEDGE</p>
      <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
      <p style="color: rgb(0, 0, 95); margin: 0px;">1. What can you tell us about the student’s knowledge of this subject?</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
          <div style="border-radius: 50%; height: 13px; width: 13px; background-color: rgb(0, 0, 95);"></div>
          <p style="margin: 0px;background-color: orange;padding: 5px;">${item.knowledge
          }</p>
      </div>
  </div>
  </div>
  <div style="margin-top: 30px;">
      <p style="background-color: orangered;color: white;font-weight: 700;padding: 5px; margin: 0px;">B. UNDERSTANDING</p>
      <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
      <p style="color: rgb(0, 0, 95); margin: 0px;">1. What can you tell about the student’s understanding of this subject?</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
          <div style="border-radius: 50%; height: 13px; width: 13px; background-color: rgb(0, 0, 95);"></div>
          <p style="margin: 0px;background-color: orange;padding: 5px;">${item.understanding
          }</p>
      </div>
  </div>
  <div style="margin-top: 30px;">
      <p style="background-color: orangered;color: white;font-weight: 700;padding: 5px; margin: 0px;">C. ANALYSIS</p>
      <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
      <p style="color: rgb(0, 0, 95); margin: 0px;">1. What can you tell about the student’s understanding of this subject?</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
          <div style="border-radius: 50%; height: 13px; width: 13px; background-color: rgb(0, 0, 95);"></div>
          <p style="margin: 0px;background-color: orange;padding: 5px;">${item.analysis
          }</p>
      </div>
  </div>
  <div style="margin-top: 30px;">
  <p style="background-color: orangered;color: white;font-weight: 700;padding: 5px; margin: 0px;">D. ADDITIONAL ASSESMENT</p>
  <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
  <p style="color: rgb(0, 0, 95); margin: 0px;">1. What is the current score for the subject?</p>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
      <p style="margin: 0px;">${item.additionalAssisment}</p>
  </div>
  </div>
  <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
  <p style="color: rgb(0, 0, 95); margin: 0px;">2. Elaborate your plan to help the student?</p>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
      <p style="margin: 0px;">${item.plan}</p>
  </div>
  </div>
</div>
  </div>
        
        </body></html>`,
        fileName: `report${Math.random()}`,
        directory: 'Downloads',
        base64: false,
      };
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error('Permission denied for writing to external storage.');
          return
        }
      }

      const pdfFile = await RNHTMLtoPDF.convert(options);
      const { filePath }: any = pdfFile;
      return filePath
    } catch (error) {
      console.log('Error generating and downloading the PDF:', error);
      throw error
    }
  };

  const handleGenerateAndDownloadPdf = async (item: any) => {
    try {
      const pdfUri: any = await generateAndDownalodPdf(item);
      setPdfUri(pdfUri); // Set the local file URI of the downloaded PDF

    } catch (error) {
      console.log('Error generating and downloading the PDF:', error);
    }
  };



  const generateDownloadProgressReport = async (item: any): Promise<string | undefined> => {

    console.log(item, "items")

    try {
      const options = {
        html: `        <html>
        <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
          }
        </style>
      </head>
        <body>
        <div>
        <div>
       
        <div style="display: flex; justify-content: space-between;">
          <div style="display: flex; flex-direction: column; width: 45%">
            <img src="./logo.png" alt="logo" style="width: 70px" />
            <p style="color: blue";margin-top: 20px;>Sifu Edu & Learning Sdn Bhd (1270698-W)</p>
            <p style="margin-top: 5px;">1-1F, Jalan Setia Perdana BE U13/BE Setia Alam, Shah Alam, 40170,
              Selangor Tel: 603-5888 4827</p>
          </div>
          <div style="display: flex; flex-direction: column; width: 50%">
            <span
              style="font-size: 25px; background-color: orangered;
               color: white; padding: 8px; white-space: pre; font-weight: 700;margin-top: 20px;"
              >${item.tutorReportType}</span>
          </div>
        </div>
        
        <div style="display: flex; align-items: center;gap: 10px;">
        <h3 style="background-color: orangered; padding: 10px;margin-right: 5px;color: white;width:80px;">Student</h3>
        <h3 style='white-space: pre;'>${item.studentName}</h3>
      </div>
        <div style="display: flex; flex-direction: row;gap:10px;">
          <div style="display: flex; align-items: center;gap:5px;">
            <h3 style="background-color: orangered; padding: 10px;margin-right: 5px;color: white;width:80px;">Tutor</h3>
            <h3 style='white-space: pre;'>${item.tutorName}</h3>
          </div>
          <div style="display: flex; align-items: center;gap:5px;">
            <h3 style="background-color: orangered; padding: 10px;margin-right: 5px;color: white;width:80px;">Subject</h3>
            <h3 style='white-space: pre;'>${item.subjectName}</h3>
          </div>
          <div style="display: flex; align-items: center;gap:5px;">
            <h3 style="background-color: orangered; padding: 10px;margin-right: 5px;color: white;width:80px;">Month</h3>
            <h3 style='white-space: pre;'>${item.month}</h3>
          </div>
        </div>
      </div>

      <div>
      <p style="background-color: orangered;color: white;font-weight: 700;padding: 5px; margin: 0px;">A. KNOWLEDGE</p>
      <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
      <p style="color: rgb(0, 0, 95); margin: 0px;">1. What can you tell us about the student’s knowledge of this subject?</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
          <div style="border-radius: 50%; height: 13px; width: 13px; background-color: rgb(0, 0, 95);"></div>
          <p style="margin: 0px;background-color: orange;padding: 5px;">${item.knowledge
          }</p>
      </div>
  </div>
  </div>
  <div style="margin-top: 30px;">
      <p style="background-color: orangered;color: white;font-weight: 700;padding: 5px; margin: 0px;">B. UNDERSTANDING</p>
      <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
      <p style="color: rgb(0, 0, 95); margin: 0px;">1. What can you tell about the student’s understanding of this subject?</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
          <div style="border-radius: 50%; height: 13px; width: 13px; background-color: rgb(0, 0, 95);"></div>
          <p style="margin: 0px;background-color: orange;padding: 5px;">${item.rate_student_understanding_on_this_subject
          }</p>
      </div>
  </div>
  <div style="margin-top: 30px;">
      <p style="background-color: orangered;color: white;font-weight: 700;padding: 5px; margin: 0px;">C. ANALYSIS</p>
      <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
      <p style="color: rgb(0, 0, 95); margin: 0px;">1. What can you tell about the student’s understanding of this subject?</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
          <div style="border-radius: 50%; height: 13px; width: 13px; background-color: rgb(0, 0, 95);"></div>
          <p style="margin: 0px;background-color: orange;padding: 5px;">${item.how_is_the_student_performance_on_homework
          }</p>
      </div>
  </div>
  <div style="margin-top: 30px;">
  <p style="background-color: orangered;color: white;font-weight: 700;padding: 5px; margin: 0px;">D. ADDITIONAL ASSESMENT</p>
  <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
  <p style="color: rgb(0, 0, 95); margin: 0px;">1. What is the current score for the subject?</p>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
      <p style="margin: 0px;">${item.how_well_student_answers}</p>
  </div>
  </div>
  <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
  <p style="color: rgb(0, 0, 95); margin: 0px;">2. Elaborate your plan to help the student?</p>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
      <p style="margin: 0px;">${item.how_you_can_rate_student_attendance_for_3_months}</p>
  </div>
  </div>
</div>
  </div>
        
        </body></html>`,
        fileName: `report${Math.random()}`,
        directory: 'Downloads',
        base64: false,
      };
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error('Permission denied for writing to external storage.');
          return
        }
      }

      const pdfFile = await RNHTMLtoPDF.convert(options);
      const { filePath }: any = pdfFile;
      return filePath
    } catch (error) {
      console.log('Error generating and downloading the PDF:', error);
      throw error
    }
  };


  const handleGenerateProgressReport = async (item: any) => {
    try {
      const pdfUri: any = await generateDownloadProgressReport(item);
      setPdfUri(pdfUri); // Set the local file URI of the downloaded PDF

    } catch (error) {
      console.log('Error generating and downloading the PDF:', error);
    }
  }






  return (
    loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
      <ActivityIndicator size="large" color={Theme.black} />
    </View>
      :
      pdfUri ? <View style={{ flex: 1 }} >
        <Pdf source={{ uri: pdfUri }} style={{ flex: 1, backgroundColor: "gray", marginBottom: 5 }} />
        <TouchableOpacity onPress={() => setPdfUri("")} style={{ width: "100%", alignSelf: "center", padding: 10, backgroundColor: "black" }} >
          <Text style={{ fontSize: 16, textAlign: "center", color: "white" }} >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
        :
        <View style={{ backgroundColor: Theme.white, height: '100%' }}>
          <Header title="Student Reports" backBtn navigation={navigation} />
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false} nestedScrollEnabled>
            <View style={{ paddingHorizontal: 15 }}>
              {/* Search */}
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: Theme.lightGray,
                    borderRadius: 10,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    marginVertical: 15,
                  }}>
                  <TextInput
                    placeholder="Search"
                    placeholderTextColor="black"
                    onChangeText={e => searchStudent(e)}
                    style={{ width: '90%', padding: 8, color: 'black' }}
                  />
                  <TouchableOpacity onPress={() => navigation}>
                    <Image
                      source={require('../../Assets/Images/search.png')}
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {allReports && allReports.length > 0 ? (
                <FlatList
                  data={
                    searchText && foundName.length > 0
                      ? foundName
                      : allReports
                  }
                  nestedScrollEnabled
                  keyExtractor={(item: any) => item.id}
                  renderItem={({ item, index }: any) => {



                    return (
                      <View
                        key={index}
                        style={{
                          borderWidth: 1,
                          paddingHorizontal: 15,
                          marginTop: 10,
                          paddingVertical: 15,
                          borderRadius: 10,
                          gap: 10,
                          marginRight: 10,
                          borderColor: '#eee',
                          width: '100%',
                        }}>
                        {/* Avaiable Subject */}
                        <View style={{}}>
                          <Text
                            style={{
                              color: Theme.black,
                              fontSize: 12,
                              fontWeight: '600',
                            }}>
                            {item.studentID}
                          </Text>
                          <Text
                            style={{
                              color: Theme.gray,
                              fontSize: 12,
                              fontWeight: '600',
                              paddingVertical: 10,
                            }}>
                            {item.studentName}
                          </Text>
                          <Text
                            style={{
                              color: Theme.black,
                              fontSize: 12,
                              fontWeight: '600',
                            }}>
                            Subimited on {item.created_at}
                          </Text>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text
                              style={{
                                color: Theme.gray,
                                fontSize: 12,
                                fontWeight: '600',
                                paddingTop: 10,
                              }}>
                              {item?.tutorReportType ?? item.reportType}
                            </Text>
                            <TouchableOpacity onPress={() => item.reportType ? handleGenerateProgressReport(item) : handleGenerateAndDownloadPdf(item)} style={{ alignItems: "center" }} >
                              <Image source={require('../../Assets/Images/inbox.png')} style={{ width: 25, height: 25 }} resizeMode='contain' />
                              <Text style={{ fontSize: 10, color: "black" }}>Download</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                />
              ) : (
                <View style={{ marginTop: 35 }}>
                  <Text
                    style={{ color: Theme.black, fontSize: 12, textAlign: 'center' }}>
                    No Record Found...
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
  );
};

export default ReportSubmissionHistory;

const styles = StyleSheet.create({});