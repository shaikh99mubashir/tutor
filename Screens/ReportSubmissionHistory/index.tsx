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
  Linking,
  PermissionsAndroid,
  RefreshControl,
  NativeModules,
  Dimensions,
  ToastAndroid,
  Modal,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {Theme} from '../../constant/theme';
import Header from '../../Component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Pdf from 'react-native-pdf';
import reportSubmissionContext from '../../context/reportSubmissionContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import bannerContext from '../../context/bannerContext';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import CustomLoader from '../../Component/CustomLoader';
const ReportSubmissionHistory = ({navigation}: any) => {
  // const [reportSubmission, setreportSubmission] = useState([]);
  // const [progressReport, setProgressReport] = useState([]);

  let context = useContext(reportSubmissionContext);
  let bannerCont = useContext(bannerContext);

  let {reportSubmissionBanner, setReportSubmissionBanner} = bannerCont;
  const tutorDetailsContext = useContext(TutorDetailsContext);
  let {tutorDetails} = tutorDetailsContext;

  let {
    reportSubmission,
    setreportSubmission,
    progressReport,
    setProgressReport,
  } = context;

  const [foundName, setFoundName] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfUri, setPdfUri] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [refresh, setRefresh] = useState(false);
  const [openPPModal, setOpenPPModal] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setRefresh(!refresh);
      setOpenPPModal(true);
    }, 2000);
  }, [refresh]);

  const getReportSubmissionHistory = async () => {
    if (refresh) {
      setLoading(true);
      let data: any = await AsyncStorage.getItem('loginAuth');
      data = JSON.parse(data);
      let {tutorID} = data;
      axios
        .get(`${Base_Uri}api/tutorFirstReportListing/${tutorID}`)
        .then(({data}) => {
          let {tutorReportListing} = data;
          setreportSubmission(tutorReportListing);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          ToastAndroid.show('Network Error', ToastAndroid.LONG);
        });
    }
  };

  const getProgressReportHistory = async () => {
    if (refresh) {
      setLoading(true);

      let data: any = await AsyncStorage.getItem('loginAuth');

      data = JSON.parse(data);

      let {tutorID} = data;

      axios
        .get(`${Base_Uri}api/progressReportListing`)
        .then(({data}) => {
          let {progressReportListing} = data;

          let tutorReport =
            progressReportListing &&
            progressReportListing.length > 0 &&
            progressReportListing.filter((e: any, i: number) => {
              return e.tutorID == tutorID;
            });

          // console.log(tutorReport, "reoirt")
          setProgressReport(
            tutorReport && tutorReport.length > 0 ? tutorReport : [],
          );
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          console.log('error');
          ToastAndroid.show('Network Error', ToastAndroid.LONG);
        });
    }
  };

  useEffect(() => {
    getReportSubmissionHistory();
    getProgressReportHistory();
  }, [refresh]);

  let allReports = [...reportSubmission, ...progressReport];

  const [searchText, setSearchText] = useState('');
  const searchStudent = (e: any) => {
    setSearchText(e);
    if (e.length == 0) {
      setSearchText('');
      setFoundName([]);
      return;
    }

    let filteredItems: any = allReports.filter((x: any) => {
      if (x?.studentID?.toString().toLowerCase().includes(e?.toLowerCase())) {
        return x;
      } else if (
        x?.studentName?.toString().toLowerCase().includes(e?.toLowerCase())
      ) {
        return x;
      }
    });
    setFoundName(filteredItems);
  };
  const closeBannerModal = async () => {
    if (reportSubmissionBanner.displayOnce == 'on') {
      let bannerData = {...reportSubmissionBanner};

      let stringData = JSON.stringify(bannerData);

      let data = await AsyncStorage.setItem('reportBanner', stringData);
      setReportSubmissionBanner([]);
      setOpenPPModal(false);
    } else {
      setOpenPPModal(false);
    }
  };

  const generateAndDownalodPdf = async (
    item: any,
  ): Promise<string | undefined> => {
    try {
      const options = {
        html: `<html>
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
            padding:0;
            margin:0;
          }
        </style>
      </head>
        <body>
        <div>
        <div>
       
        <div style="display: flex; justify-content: space-between;">
          <div style="display: flex; flex-direction: column; width: 45%">
            <img src=${item.logo} alt="logo" style="width: 150px" />
            <span style="color: blue";margin-top: 15px;>Sifu Edu & Learning Sdn Bhd (1270698-W)</span>
            <span style="margin-top: 15px;">1-1F, Jalan Setia Perdana BE U13/BE Setia Alam, Shah Alam, 40170,
              Selangor Tel: 603-5888 4827</span>
          </div>
          <div style="display: flex; flex-direction: column; width: 50%">
            <p
              style="font-size: 25px; background-color: #2241b6;
               color: white; padding: 8px; white-space: pre; font-weight: 700;margin-top: 20px;"
              >${item.reportType}</p>
          </div>
        </div>
        
    <table style="border-collapse: collapse; width: 100%; margin-top:20px; margin-bottom:20px;">
    <tr>
      <td style="border: 1px solid black; padding: 10px;width:100px;">
        <h3 style="margin: 0; color: black;">Student:</h3>
      </td>
      <td style="border: 1px solid black; padding: 10px;">
        <p style="margin: 0; font-size: 20px;">${item.studentName}</p>
      </td>
      <td style="border: 1px solid black; padding: 10px; width:100px;">
        <h3 style="margin: 0; color: black;">Subject:</h3>
      </td>
      <td style="border: 1px solid black; padding: 10px;">
        <p style="margin: 0; font-size: 20px;">${item.subjectName}</p>
      </td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 10px; ">
        <h3 style="margin: 0; color: black;">Tutor:</h3>
      </td>
      <td style="border: 1px solid black; padding: 10px;">
        <p style="margin: 0; font-size: 20px;">${item.tutorName}</p>
      </td>
      <td style="border: 1px solid black; padding: 10px;">
        <h3 style="margin: 0; color: black;">Month:</h3>
      </td>
      <td style="border: 1px solid black; padding: 10px;">
        <p style="margin: 0; font-size: 20px;">${item.month}</p>
      </td>
    </tr>
  </table>


 

      <div>
      <p style="background-color: black;color: white;font-weight: 700;padding: 5px; marginTop: 10px;">A. KNOWLEDGE</p>
      <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
      <p style="color: rgb(0, 0, 95); margin: 0px;">1.How well does the student recall basic concepts?</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.knowledge ===
          'Remember most concepts with minimal errors.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.knowledge ===
          'Remember most concepts with minimal errors.'
            ? 'Remember most concepts with minimal errors.'
            : 'Remember most concepts with minimal errors.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.knowledge ===
          'Remember basic concepts after receiving guidance.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.knowledge ===
          'Remember basic concepts after receiving guidance.'
            ? 'Remember basic concepts after receiving guidance.'
            : 'Remember basic concepts after receiving guidance.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.knowledge ===
          'Struggles to remember concepts without a lot of help.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.knowledge ===
          'Struggles to remember concepts without a lot of help.'
            ? 'Struggles to remember concepts without a lot of help.'
            : 'Struggles to remember concepts without a lot of help.'
        }</p>
      </div>

      <p style="color: rgb(0, 0, 95); margin-top: 10px;">2. How well does the student share their ideas on the topics under discussion?</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.knowledge2 ===
          'Able to share their ideas clearly and actively.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.knowledge2 ===
          'Able to share their ideas clearly and actively.'
            ? 'Able to share their ideas clearly and actively.'
            : 'Able to share their ideas clearly and actively.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.knowledge2 ===
          'Shares ideas after receiving guidance.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.knowledge2 ===
          'Shares ideas after receiving guidance.'
            ? 'Shares ideas after receiving guidance.'
            : 'Shares ideas after receiving guidance.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.knowledge2 ===
          'Struggles to put ideas into words and rarely expresses thoughts.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.knowledge2 ===
          'Struggles to put ideas into words and rarely expresses thoughts.'
            ? 'Struggles to put ideas into words and rarely expresses thoughts.'
            : 'Struggles to put ideas into words and rarely expresses thoughts.'
        }</p>
      </div>
      
      
      
     
  </div>
  </div>
  <div style="margin-top: 20px;">
      <p style="background-color: black;color: white;font-weight: 700;padding: 5px; margin: 0px;">B. UNDERSTANDING</p>
      <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
      <p style="color: rgb(0, 0, 95); margin: 0px;">1. How well does the student explain the basic concepts?</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.understanding ===
          'Explains concepts clearly and accurately.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.understanding ===
          'Explains concepts clearly and accurately.'
            ? 'Explains concepts clearly and accurately.'
            : 'Explains concepts clearly and accurately.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.understanding ===
          'Explains basic concepts clearly but with a few errors.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.understanding ===
          'Explains basic concepts clearly but with a few errors.'
            ? 'Explains basic concepts clearly but with a few errors.'
            : 'Explains basic concepts clearly but with a few errors.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.understanding ===
          'Struggles to explain concepts and makes many mistakes.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.understanding ===
          'Struggles to explain concepts and makes many mistakes.'
            ? 'Struggles to explain concepts and makes many mistakes.'
            : 'Struggles to explain concepts and makes many mistakes.'
        }</p>
      </div>

      <p style="color: rgb(0, 0, 95); margin-top: 10px;">2. How well does the student apply learned concepts to solve problems or answer questions?</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.understanding2 ===
          'Applies concepts well and solves most problems correctly.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.understanding2 ===
          'Applies concepts well and solves most problems correctly.'
            ? 'Applies concepts well and solves most problems correctly.'
            : 'Applies concepts well and solves most problems correctly.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.understanding2 ===
          'Applies concepts well and solves certain questions correctly.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.understanding2 ===
          'Applies concepts well and solves certain questions correctly.'
            ? 'Applies concepts well and solves certain questions correctly.'
            : 'Applies concepts well and solves certain questions correctly.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.understanding2 ===
          'Unable to apply concepts and solve problems correctly.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.understanding2 ===
          'Unable to apply concepts and solve problems correctly.'
            ? 'Unable to apply concepts and solve problems correctly.'
            : 'Unable to apply concepts and solve problems correctly.'
        }</p>
      </div>
  </div>
  <div style="margin-top: 20px;">
      <p style="background-color: black;color: white;font-weight: 700;padding: 5px; margin: 0px;">C. CRITICAL THINKING</p>
      <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
      <p style="color: rgb(0, 0, 95); margin: 0px;">1. How well does the student solve different types of questions with minimal guidance?</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.criticalThinking ===
          'Solves many different questions correctly on their own.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.criticalThinking ===
          'Solves many different questions correctly on their own.'
            ? 'Solves many different questions correctly on their own.'
            : 'Solves many different questions correctly on their own.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.criticalThinking ===
          'Solves most questions correctly with little guidance.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.criticalThinking ===
          'Solves most questions correctly with little guidance.'
            ? 'Solves most questions correctly with little guidance.'
            : 'Solves most questions correctly with little guidance.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.criticalThinking === 'Answers some questions correctly but needs a lot of guidance.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.criticalThinking === 'Answers some questions correctly but needs a lot of guidance.'
            ? 'Answers some questions correctly but needs a lot of guidance.'
            : 'Answers some questions correctly but needs a lot of guidance.'
        }</p>
      </div>

      <p style="color: rgb(0, 0, 95); margin-top: 10px;">2. How well is the is the student able to answer questions using a variety of methods and concepts?</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.criticalThinking2 ===
          'Able to answer questions using many different methods and concepts.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.criticalThinking2 ===
          'Able to answer questions using many different methods and concepts.'
            ? 'Able to answer questions using many different methods and concepts.'
            : 'Able to answer questions using many different methods and concepts.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.criticalThinking2 ===
          'Able to use various methods and concepts, but not frequently.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.criticalThinking2 ===
          'Able to use various methods and concepts, but not frequently.'
            ? 'Able to use various methods and concepts, but not frequently.'
            : 'Able to use various methods and concepts, but not frequently.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.criticalThinking2 === 'Finds it hard to use different methods and concepts to answer questions.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px; padding: 5px;">${
          item.criticalThinking2 === 'Finds it hard to use different methods and concepts to answer questions.'
            ? 'Finds it hard to use different methods and concepts to answer questions.'
            : 'Finds it hard to use different methods and concepts to answer questions.'
        }</p>
      </div>
  </div>
  <div style="margin-top: 20px;">
  <p style="background-color: black;color: white;font-weight: 700;padding: 5px; margin: 0px;">D. OBSERVATION</p>
  <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
  <p style="color: rgb(0, 0, 95); margin: 0px;">What is the student's learning style so that you can personalize tutoring sessions effectively?</p>
 
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
    <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
      item.observation ===
      'Visual: Learns with images and diagrams.'
        ? 'rgb(0, 0, 95)'
        : 'white'
    };border: 2px solid rgb(0, 0, 95);"></div>
    <p style="margin: 0px; padding: 5px;">${
      item.observation ===
      'Visual: Learns with images and diagrams.'
        ? 'Visual: Learns with images and diagrams.'
        : 'Visual: Learns with images and diagrams.'
    }</p>
  </div>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
    <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
      item.observation === 'Auditory: Listening and verbal instruction.'
        ? 'rgb(0, 0, 95)'
        : 'white'
    };border: 2px solid rgb(0, 0, 95);"></div>
    <p style="margin: 0px; padding: 5px;">${
      item.observation === 'Auditory: Listening and verbal instruction.'
        ? 'Auditory: Listening and verbal instruction.'
        : 'Auditory: Listening and verbal instruction.'
    }</p>
  </div>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.observation ===
    'Reading/Writing: Reading and writing notes.'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px; padding: 5px;">${
    item.observation ===
    'Reading/Writing: Reading and writing notes.'
      ? 'Reading/Writing: Reading and writing notes.'
      : 'Reading/Writing: Reading and writing notes.'
  }</p>
</div>
<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
  item.observation ===
  'Multimodal: Learns best with a combination of styles.'
    ? 'rgb(0, 0, 95)'
    : 'white'
};border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
  item.observation ===
  'Multimodal: Learns best with a combination of styles.'
    ? 'Multimodal: Learns best with a combination of styles.'
    : 'Multimodal: Learns best with a combination of styles.'
}</p>
</div>
</div>
  <div style="margin-top: 20px;">
  <p style="background-color: black;color: white;font-weight: 700;padding: 5px; margin: 0px;">E. ADDITIONAL ASSESMENT</p>
  <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
  <p style="color: rgb(0, 0, 95); margin: 0px;">1. What is the current score for the first assessement? [SCORE]/10</p>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
      <p style="margin: 0px;padding-left: 18px;">${item.additionalAssisment == null ? '-': item.additionalAssisment}</p>

  </div>
  </div>
  <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
  <p style="color: rgb(0, 0, 95); margin: 0px;">2. Describe your tutoring plan to help the students.</p>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
      <p style="margin: 0px; padding-left: 18px;">${item.plan == null ? '-' :item.plan}</p>
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
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error('Permission denied for writing to external storage.');
          return;
        }
      }

      const pdfFile = await RNHTMLtoPDF.convert(options);
      const {filePath}: any = pdfFile;
      return filePath;
    } catch (error) {
      console.log('Error generating and downloading the PDF:', error);
      throw error;
    }
  };

  const handleGenerateAndDownloadPdf = async (item: any) => {
    console.log('item', item);
    try {
      const pdfUri: any = await generateAndDownalodPdf(item);
      setPdfUri(pdfUri); // Set the local file URI of the downloaded PDF
    } catch (error) {
      console.log('Error generating and downloading the PDF:', error);
    }
  };

  const generateDownloadProgressReport = async (
    item: any,
  ): Promise<string | undefined> => {
    try {
      const options = {
        html: `
        <html>
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
            <img src=${item.logo} alt="logo" style="width: 150px" />
            <p style="color: blue";margin-top: 0px;>Sifu Edu & Learning Sdn Bhd (1270698-W)</p>
            <p style="margin-top: 0px;">1-1F, Jalan Setia Perdana BE U13/BE Setia Alam, Shah Alam, 40170,
              Selangor Tel: 603-5888 4827</p>
          </div>
          <div style="display: flex; flex-direction: column; width: 50%">
            <span
              style="font-size: 25px; background-color: #2241b6;
               color: white; padding: 8px; white-space: pre; font-weight: 700;margin-top: 20px;"
              >${item.reportType}</span>
          </div>
        </div>
        

       <table style="border-collapse: collapse; width: 100%;">
  <tr>
    <td style="border: 1px solid black; padding: 10px;width:100px;">
      <h3 style="margin: 0; color: black;">Student:</h3>
    </td>
    <td style="border: 1px solid black; padding: 10px;">
      <p style="margin: 0; font-size: 20px;">${item.studentName}</p>
    </td>
    <td style="border: 1px solid black; padding: 10px; width:100px;">
      <h3 style="margin: 0; color: black;">Subject:</h3>
    </td>
    <td style="border: 1px solid black; padding: 10px;">
      <p style="margin: 0; font-size: 20px;">${item.subjectName}</p>
    </td>
  </tr>
  <tr>
    <td style="border: 1px solid black; padding: 10px; ">
      <h3 style="margin: 0; color: black;">Tutor:</h3>
    </td>
    <td style="border: 1px solid black; padding: 10px;">
      <p style="margin: 0; font-size: 20px;">${item.tutorName}</p>
    </td>
    <td style="border: 1px solid black; padding: 10px;">
      <h3 style="margin: 0; color: black;">Month:</h3>
    </td>
    <td style="border: 1px solid black; padding: 10px;">
      <p style="margin: 0; font-size: 20px;">${item.month}</p>
    </td>
  </tr>
</table>

          <div style="margin:10px;"></div>
      

      <div>
      <p style="background-color: black;color: white;font-weight: 700;padding: 5px; margin: 0px;">A. OBSERVATION</p>
      <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
      <p style="color: rgb(0, 0, 95); margin-top: 5px; margin-bottom:5px;">1.  Did you (tutor) hold or carried out any form of examination/test/quiz for the student within this 3 months?</p>
      <div style='display:flex; flex-direction:row; gap:20px'>
      <div style="display: flex; align-items: center; gap: 15px; padding-bottom: 0px; padding-top: 0px;">
      <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
        item.observation === 'Yes' ? 'rgb(0, 0, 95)' : 'white'
      };border: 2px solid rgb(0, 0, 95);"></div>
      <p style="margin: 0px; padding: 0px;">${item.observation === 'Yes' ? 'Yes' : 'No'}</p>
    </div>

      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
      <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
        item.observation === 'No' ? 'rgb(0, 0, 95)' : 'white'
      };border: 2px solid rgb(0, 0, 95);"></div>
      <p style="margin: 0px; padding: 0px;">${item.observation === 'No' ? 'No' : 'No'}</p>
    </div>
</div>


<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">2. What is the student's learning style?</p>
<div style=''>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
      <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
        item.observation2 === 'Visual: Learns with images and diagrams.'
          ? 'rgb(0, 0, 95)'
          : 'white'
      };border: 2px solid rgb(0, 0, 95);"></div>
      <p style="margin: 0px; padding: 5px;">${
          item.observation2 === 'Visual: Learns with images and diagrams.'
            ? 'Visual: Learns with images and diagrams.'
            : 'Visual: Learns with images and diagrams.'
        }</p>
    </div>

      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
      <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
        item.observation2 === 'Auditory: Listening and verbal instruction.'
          ? 'rgb(0, 0, 95)'
          : 'white'
      };border: 2px solid rgb(0, 0, 95);"></div>
      <p style="margin: 0px; padding: 5px;">${
          item.observation2 === 'Auditory: Listening and verbal instruction.'
            ? 'Auditory: Listening and verbal instruction.'
            : 'Auditory: Listening and verbal instruction.'
        }</p>
    </div>

    <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
    <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
      item.observation2 === 'Reading/Writing: Reading and writing notes.'
        ? 'rgb(0, 0, 95)'
        : 'white'
    };border: 2px solid rgb(0, 0, 95);"></div>
    <p style="margin: 0px; padding: 5px;">${
          item.observation2 === 'Reading/Writing: Reading and writing notes.'
            ? 'Reading/Writing: Reading and writing notes.'
            : 'Reading/Writing: Reading and writing notes.'
        }</p>
  </div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.observation2 === 'Multimodal: Learns best with a combination of styles'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px; padding: 5px;">${
          item.observation2 ===
          'Multimodal: Learns best with a combination of styles'
            ? 'Multimodal: Learns best with a combination of styles'
            : 'Multimodal: Learns best with a combination of styles'
        }</p>
</div>
</div>


<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">3. What significant improvement do you see in the student's performance compared to before?</p>
<p style="margin: 0px; padding-left: 18px;">${item.observation3 == null ? '-' : item.observation3}</p>
<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">4. Please suggest the parts that the student should improve and focus on?</p>
<p style="margin: 0px; padding-left: 18px;">${item.observation4 == null ? '-' : item.observation4}</p>
<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">5. Please elaborate your plans for the student in 3 months' time from now?</p>
<p style="margin: 0px; padding-left: 18px;">${item.observation5 == null ? '-' : item.observation5}</p>
<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">6. Comment (Additional)</p>
<p style="margin: 0px; padding-left: 18px;">${item.observation6 == null ? '-' : item.observation6}</p>
  </div>
  </div>
  
  <div style="margin-top: 10px;">
  <p style="background-color: black;color: white;font-weight: 700;padding: 5px; margin: 0px;">B. PERFORMANCE</p>
  <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 10px;">
  <p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">1. How well does the student understand this subject?</p>
  <div style=''>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.performance === 'Strong understanding.' ? 'rgb(0, 0, 95)' : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px; padding: 5px;">${
          item.performance === 'Strong understanding.'
            ? 'Strong understanding.'
            : 'Strong understanding.'
        }</p>
</div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.performance === 'Basic understanding.' ? 'rgb(0, 0, 95)' : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px; padding: 5px;">${
          item.performance === 'Basic understanding.'
            ? 'Basic understanding.'
            : 'Basic understanding.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.performance === 'Little to no understanding.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.performance === 'Little to no understanding.'
            ? 'Little to no understanding.'
            : 'Little to no understanding.'
        }</p>
</div>
</div>

<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">2. How well the student’s performance during these 3 months ?</p>
  <div style=''>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.performance2 === 'Outstanding performance.' ? 'rgb(0, 0, 95)' : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px; padding: 5px;">${
          item.performance2 === 'Outstanding performance.'
            ? 'Outstanding performance.'
            : 'Outstanding performance.'
        }</p>
</div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.performance2 === ' Adequate performance with room for improvement.'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px; padding: 5px;">${
          item.performance2 ===
          ' Adequate performance with room for improvement.'
            ? ' Adequate performance with room for improvement.'
            : ' Adequate performance with room for improvement.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.performance2 === 'Consistently below expectations'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.performance2 === 'Consistently below expectations'
            ? 'Consistently below expectations'
            : 'Consistently below expectations'
        }</p>
</div>
</div>

<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">3. How well student’s participates in learning session?</p>
  <div style=''>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.performance3 === 'Highly engaged, frequently asks questions.'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px; padding: 5px;">${
          item.performance3 === 'Highly engaged, frequently asks questions.'
            ? 'Highly engaged, frequently asks questions.'
            : 'Highly engaged, frequently asks questions.'
        }</p>
</div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.performance3 === 'Participates and occasionally asks questions.'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px; padding: 5px;">${
          item.performance3 === 'Participates and occasionally asks questions.'
            ? 'Participates and occasionally asks questions.'
            : 'Participates and occasionally asks questions.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.performance3 === 'Does not participate or ask questions.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.performance3 === 'Does not participate or ask questions.'
            ? 'Does not participate or ask questions.'
            : 'Does not participate or ask questions.'
        }</p>
</div>
</div>

<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">4. How well student answers/explains/elaborates questions given by tutor?</p>
  <div style=''>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.performance4 === 'Clear answers, in-depth explanations.'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px; padding: 5px;">${
          item.performance4 === 'Clear answers, in-depth explanations.'
            ? 'Clear answers, in-depth explanations.'
            : 'Clear answers, in-depth explanations.'
        }</p>
</div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.performance4 === 'Adequate answers, basic explanations.'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px; padding: 5px;">${
          item.performance4 === 'Adequate answers, basic explanations.'
            ? 'Adequate answers, basic explanations.'
            : 'Adequate answers, basic explanations.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.performance4 ===
          'Unable to answer clearly, little to no explanations.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.performance4 ===
          'Unable to answer clearly, little to no explanations.'
            ? 'Unable to answer clearly, little to no explanations.'
            : 'Unable to answer clearly, little to no explanations.'
        }</p>
</div>
</div>

<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">5. How would you rate the student's level of improvement over the past month?</p>
  <div style=''>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.performance5 === 'Significant improvement in many topics.'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px; padding: 5px;">${
          item.performance5 === 'Significant improvement in many topics.'
            ? 'Significant improvement in many topics.'
            : 'Significant improvement in many topics.'
        }</p>
</div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.performance5 === 'Some improvement in specific topic.'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px; padding: 5px;">${
          item.performance5 === 'Some improvement in specific topic.'
            ? 'Some improvement in specific topic.'
            : 'Some improvement in specific topic.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.performance5 === 'No noticeable improvement.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.performance5 === 'No noticeable improvement.'
            ? 'No noticeable improvement.'
            : 'No noticeable improvement.'
        }</p>
</div>
<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">6. Comment (Additional)</p>
<p style="margin: 0px; padding-left: 18px;">${item.performance6 == null ? '-' : item.performance6}</p>
</div>

  </div>
  </div>

<div style="margin-top: 10px;">
<p style="background-color: black;color: white;font-weight: 700;padding: 5px; margin: 0px;">C. ATTITUDE</p>
<div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 10px;">
<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">1. How well student’s attendance for 3 months?</p>
<div style=''>
<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.attitude === 'Rarely absent, consistently on time.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.attitude === 'Rarely absent, consistently on time.'
            ? 'Rarely absent, consistently on time.'
            : 'Rarely absent, consistently on time.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.attitude ===
          'Sometimes absent or late, but with reasonable excuses.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.attitude ===
          'Sometimes absent or late, but with reasonable excuses.'
            ? 'Sometimes absent or late, but with reasonable excuses.'
            : 'Sometimes absent or late, but with reasonable excuses.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.attitude ===
          'Regularly absent or late, significantly impacts participation.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.attitude ===
          'Regularly absent or late, significantly impacts participation.'
            ? 'Regularly absent or late, significantly impacts participation.'
            : 'Regularly absent or late, significantly impacts participation.'
        }</p>
</div>
</div>

<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">2. How well do you interact/communicate with student during/after class?</p>
<div style=''>
<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.attitude2 === 'Communication is very effective and frequent.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.attitude2 === 'Communication is very effective and frequent.'
            ? 'Communication is very effective and frequent.'
            : 'Communication is very effective and frequent.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.attitude2 ===
          'Communication is adequate but could be more effective.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.attitude2 ===
          'Communication is adequate but could be more effective.'
            ? 'Communication is adequate but could be more effective.'
            : 'Communication is adequate but could be more effective.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.attitude2 === 'Communication is minimal or ineffective.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.attitude2 === 'Communication is minimal or ineffective.'
            ? 'Communication is minimal or ineffective.'
            : 'Communication is minimal or ineffective.'
        }</p>
</div>
</div>

<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">3. How well the student manages their task given ?</p>
<div style=''>
<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.attitude3 === 'Completes homework ahead of deadlines.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.attitude3 === 'Completes homework ahead of deadlines.'
            ? 'Completes homework ahead of deadlines.'
            : 'Completes homework ahead of deadlines.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.attitude3 === 'Completes most homework on time.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.attitude3 === 'Completes most homework on time.'
            ? 'Completes most homework on time.'
            : 'Completes most homework on time.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.attitude3 === 'Rarely completes homework on time.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.attitude3 === 'Rarely completes homework on time.'
            ? 'Rarely completes homework on time.'
            : 'Rarely completes homework on time.'
        }</p>
</div>
</div>

<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">4. How well student's willingness to learn ?</p>
<div style=''>
<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.attitude4 === 'Shows a strong willingness to learn.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.attitude4 === 'Shows a strong willingness to learn.'
            ? 'Shows a strong willingness to learn.'
            : 'Shows a strong willingness to learn.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.attitude4 === 'Shows some interest and willingness to learn.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.attitude4 === 'Shows some interest and willingness to learn.'
            ? 'Shows some interest and willingness to learn.'
            : 'Shows some interest and willingness to learn.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.attitude4 ===
          'Rarely shows willingness to learn.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.attitude4 ===
          'Rarely shows willingness to learn.'
            ? 'Rarely shows willingness to learn.'
            : 'Rarely shows willingness to learn.'
        }</p>
</div>
</div>

<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">5. What are the student's interests towards the subject?</p>
<div style=''>
<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.attitude5 === 'Highly engaged and interested.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.attitude5 === 'Highly engaged and interested.'
            ? 'Highly engaged and interested.'
            : 'Highly engaged and interested.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.attitude5 === 'Moderately engaged.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.attitude5 === 'Moderately engaged.'
            ? 'Moderately engaged.'
            : 'Moderately engaged.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.attitude5 ===
          'Lacks engagement and interest.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.attitude5 ===
          'Lacks engagement and interest.'
            ? 'Lacks engagement and interest.'
            : 'Lacks engagement and interest.'
        }</p>
</div>
</div>

<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">6. Comment (Additional)</p>
<p style="margin: 0px; padding-left: 18px;">${item.attitude6 == null ? '-' : item.attitude6}</p>

</div>


<div style="margin-top: 10px;">
<p style="background-color: black;color: white;font-weight: 700;padding: 5px; margin: 0px;">D. RESULT</p>
<div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 10px;">
<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">1. How well does the student performance in quizzes/test?</p>
<div style=''>
<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.result === 'Consistently achieves high scores.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.result === 'Consistently achieves high scores.'
            ? 'Consistently achieves high scores.'
            : 'Consistently achieves high scores.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.result ===
          'Achieves average scores.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.result ===
          'Achieves average scores.'
            ? 'Achieves average scores.'
            : 'Achieves average scores.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.result ===
          'Consistently achieves low scores.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.result ===
          'Consistently achieves low scores.'
            ? 'Consistently achieves low scores.'
            : 'Consistently achieves low scores.'
        }</p>
</div>
</div>

<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">2. How well the student prepares for test and assignment?</p>
<div style=''>
<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.result2 === 'Always well-prepared.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.result2 === 'Always well-prepared.'
            ? 'Always well-prepared.'
            : 'Always well-prepared.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.result2 ===
          'Adequately prepared.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.result2 ===
          'Adequately prepared.'
            ? 'Adequately prepared.'
            : 'Adequately prepared.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.result2 === 'Rarely prepared.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.result2 === 'Rarely prepared.'
            ? 'Rarely prepared.'
            : 'Rarely prepared.'
        }</p>
</div>
</div>

<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">3. How is the student’s test score at school?</p>
<div style=''>
<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.result3 === 'Scores are consistently high.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.result3 === 'Scores are consistently high.'
            ? 'Scores are consistently high.'
            : 'Scores are consistently high.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.result3 === 'Scores are average.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.result3 === 'Scores are average.'
            ? 'Scores are average.'
            : 'Scores are average.'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.result3 === 'Scores are consistently low.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px; padding: 5px;">${
          item.result3 === 'Scores are consistently low.'
            ? 'Scores are consistently low.'
            : 'Scores are consistently low.'
        }</p>
</div>
</div>
<p style="color: rgb(0, 0, 95); margin-top: 10px; margin-bottom:5px;">6. Comment (Additional)</p>
<p style="margin: 0px; padding-left: 18px;">${item.result4 == null ? '-' : item.result4}</p>

</div>

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
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs access to write to your external storage',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error('Permission denied for writing to external storage.');
          return;
        }
      }

      const pdfFile = await RNHTMLtoPDF.convert(options);
      const {filePath}: any = pdfFile;
      return filePath;
    } catch (error) {
      console.log('Error generating and downloading the PDF:', error);
      throw error;
    }
  };


  const handleGenerateProgressReport = async (item: any) => {
    console.log('item', item);

    try {
      const pdfUri: any = await generateDownloadProgressReport(item);
      setPdfUri(pdfUri); // Set the local file URI of the downloaded PDF
    } catch (error) {
      console.log('Error generating and downloading the PDF:', error);
    }
  };

  console.log('pdfUri', pdfUri);

  const displayBanner = async () => {
    setOpenPPModal(true);
    axios
      .get(`${Base_Uri}api/bannerAds`)
      .then(({data}) => {})
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    displayBanner();
  }, []);

  const linkToOtherPage = () => {
    if (reportSubmissionBanner.callToActionType == 'Open URL') {
      Linking.openURL(reportSubmissionBanner.urlToOpen);
    } else if (reportSubmissionBanner.callToActionType == 'Open Page')
      if (reportSubmissionBanner.pageToOpen == 'Dashboard') {
        navigation.navigate('Home');
      } else if (reportSubmissionBanner.pageToOpen == 'Faq') {
        navigation.navigate('FAQs');
      } else if (reportSubmissionBanner.pageToOpen == 'Class Schedule List') {
        navigation.navigate('Schedule');
      } else if (reportSubmissionBanner.pageToOpen == 'Student List') {
        navigation.navigate('Students');
      } else if (reportSubmissionBanner.pageToOpen == 'Inbox') {
        navigation.navigate('inbox');
      } else if (reportSubmissionBanner.pageToOpen == 'Profile') {
        navigation.navigate('Profile');
      } else if (reportSubmissionBanner.pageToOpen == 'Payment History') {
        navigation.navigate('PaymentHistory');
      } else if (reportSubmissionBanner.pageToOpen == 'Job Ticket List') {
        navigation.navigate('Job Ticket');
      } else if (reportSubmissionBanner.pageToOpen == 'Submission History') {
        navigation.navigate('ReportSubmissionHistory');
      }
  };

  return pdfUri ? (
    <View style={{flex: 1}}>
      <Pdf
        source={{uri: pdfUri}}
        style={{flex: 1, backgroundColor: 'transparent', marginBottom: 5}}
      />
      <TouchableOpacity
        onPress={() => setPdfUri('')}
        activeOpacity={0.8}
        style={{
          width: '100%',
          alignSelf: 'center',
          padding: 10,
          backgroundColor: 'black',
        }}>
        <Text style={{fontSize: 16, textAlign: 'center', color: 'white'}}>
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <Header title="Student Reports" backBtn navigation={navigation} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled>
        <View style={{paddingHorizontal: 15}}>
          {/* Search */}
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
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
                style={{width: '90%', padding: 8, color: 'black'}}
              />
              <TouchableOpacity onPress={() => navigation}>
                <Image
                  source={require('../../Assets/Images/search.png')}
                  style={{width: 20, height: 20}}
                />
              </TouchableOpacity>
            </View>
          </View>

          {allReports && allReports.length > 0 ? (
            <View>
              <FlatList
                data={foundName.length > 0 ? foundName : allReports}
                nestedScrollEnabled
                keyExtractor={(item: any) => item.id}
                renderItem={({item, index}: any) => {
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
                          {item.student_id}
                        </Text>
                        <Text
                          style={{
                            color: Theme.gray,
                            fontSize: 12,
                            fontWeight: '600',
                            paddingVertical: 10,
                            textTransform: 'capitalize',
                          }}>
                          {item.studentName}
                        </Text>
                        <Text
                          style={{
                            color: Theme.black,
                            fontSize: 12,
                            fontWeight: '600',
                          }}>
                          Subimited on: {item.submittedDate}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              color: Theme.gray,
                              fontSize: 12,
                              fontWeight: '600',
                              paddingTop: 10,
                            }}>
                            {item?.tutorReportType ?? item.reportType}
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              item.reportType == "Student Evaluation Report"
                                ?  handleGenerateAndDownloadPdf(item)
                                : handleGenerateProgressReport(item)
                            }
                            style={{alignItems: 'center'}}>
                            <Image
                              source={require('../../Assets/Images/inbox.png')}
                              style={{width: 25, height: 25}}
                              resizeMode="contain"
                            />
                            <Text style={{fontSize: 10, color: 'black'}}>
                              Download
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          ) : (
            <View style={{marginTop: 35}}>
              <Text
                style={{color: Theme.black, fontSize: 12, textAlign: 'center'}}>
                No Record Found...
              </Text>
            </View>
          )}
          <View style={{margin:10}}></View>
        </View>
        <CustomLoader visible={loading} />
      </ScrollView>
      {Object.keys(reportSubmissionBanner).length > 0 &&
        (reportSubmissionBanner.tutorStatusCriteria == 'All' ||
          tutorDetails.status == 'verified') && (
          <View style={{flex: 1}}>
            <Modal
              visible={openPPModal}
              animationType="fade"
              transparent={true}
              onRequestClose={() => closeBannerModal()}>
              <TouchableOpacity
                onPress={() => linkToOtherPage()}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 5,
                    marginHorizontal: 20,
                  }}>
                  <TouchableOpacity onPress={() => closeBannerModal()}>
                    <View
                      style={{
                        alignItems: 'flex-end',
                        paddingVertical: 10,
                        paddingRight: 15,
                      }}>
                      <AntDesign
                        name="closecircleo"
                        size={20}
                        color={'black'}
                      />
                    </View>
                  </TouchableOpacity>
                  {/* <Image source={{uri:}} style={{width:Dimensions.get('screen').width/1.1,height:'80%',}} resizeMode='contain'/> */}
                  <Image
                    source={{uri: reportSubmissionBanner.bannerImage}}
                    style={{
                      width: Dimensions.get('screen').width / 1.1,
                      height: '80%',
                    }}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        )}
    </View>
  );
};

export default ReportSubmissionHistory;

const styles = StyleSheet.create({});
