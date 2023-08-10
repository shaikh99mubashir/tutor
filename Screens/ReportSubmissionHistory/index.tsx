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

  console.log(progressReport, "progressReport")


  useEffect(() => {

    getReportSubmissionHistory()
    getProgressReportHistory()

  }, [refresh])


  const [searchText, setSearchText] = useState('');
  const searchStudent = (e: any) => {

    setSearchText(e);
    let filteredItems: any = reportSubmission.filter((x: any) => {
      if (x?.studentID?.toLowerCase().includes(e?.toLowerCase())) {
        return e
      }
    }

    );
    setFoundName(filteredItems);
  };


  const generateAndDownalodPdf = async (item: any): Promise<string | undefined> => {

    console.log(item,"items")

    try {
      const options = {
        html: `<html><body>
        <div>
        <h1>Tutor Name</h1>
        <h2>${item.tutorName}</h3>
        </div>
        <div>
        <h1>Tutor ID</h1>
        <h3>${item.tutorID}</h3>
        </div>
        <div>
        <div>
        <h1>Tutor Address</h1>
        <h3>${item.tutorAddress1}</h3>
        </div>
        <div>
        <h1>Student Name</h1>
        <h3>${item.studentName}</h3>
        </div>
        <div>
        <h1>Student ID</h1>
        <h3>${item.studentID}</h3>
        </div>
        <div>
        <div>
        <h1>Student Address</h1>
        <h3>${item.studentAddress1}</h3>
        </div>
        <div>
        <h1>Subject Name</h1>
        <h3>${item.subjectName}</h3>
        </div>
        <div>
        <h1>Additional Assisment</h1>
        <h3>${item.additionalAssisment}</h3>
        </div>
        <div>
        <h1>Analysis</h1>
        <h3>${item.analysis}</h3>
        </div>
        <div>
        <h1>Knowledge</h1>
        <h3>${item.knowledge}</h3>
        </div>
        <div>
        <h1>Plan</h1>
        <h3>${item.plan}</h3>
        </div>
        <div>
        <h1>Understanding</h1>
        <h3>${item.understanding}</h3>
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
          <Header title="Student" backBtn navigation={navigation} />
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

              {reportSubmission && reportSubmission.length > 0 ? (
                <FlatList
                  data={
                    searchText && foundName.length > 0
                      ? foundName
                      : reportSubmission
                  }
                  nestedScrollEnabled
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
                              fontSize: 15,
                              fontWeight: '600',
                            }}>
                            {item.studentID}
                          </Text>
                          <Text
                            style={{
                              color: Theme.gray,
                              fontSize: 15,
                              fontWeight: '600',
                              paddingVertical: 10,
                            }}>
                            {item.studentName}
                          </Text>
                          <Text
                            style={{
                              color: Theme.black,
                              fontSize: 15,
                              fontWeight: '600',
                            }}>
                            Subimited on {item.created_at}
                          </Text>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text
                              style={{
                                color: Theme.gray,
                                fontSize: 15,
                                fontWeight: '600',
                                paddingTop: 10,
                              }}>
                              {item?.tutorReportType}
                            </Text>
                            <TouchableOpacity onPress={() => handleGenerateAndDownloadPdf(item)} style={{ alignItems: "center" }} >
                              <Image source={require('../../Assets/Images/inbox.png')} style={{ width: 30, height: 30 }} resizeMode='contain' />
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
                    style={{ color: Theme.black, fontSize: 14, textAlign: 'center' }}>
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