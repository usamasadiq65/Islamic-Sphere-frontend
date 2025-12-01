import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  FaSuitcase,
  FaKaaba,
  FaBookOpen,
  FaLightbulb,
  FaArrowLeft,
  FaQuestionCircle,
  FaClock,
  FaHeartbeat,
  // Imported necessary icons for the new section
  FaMapMarkerAlt,
  FaRoute,
  FaChevronRight,
} from "react-icons/fa";
import "./Prayer.css"; // Assuming this provides general styling
import "./emotionbase.css"; // Assuming this provides MUHAMMADIBOLD font
import Footer from "../components/Footer";

// Define a consistent color scheme and font for the theme
// Theme Colors (Blue/Teal and Gold/Yellow) are used from the original code:
// #055160 (Dark Teal/Blue)
// #e0c33e (Gold/Yellow)

const hajjTopics = {
  overview: {
    title: "Hajj & Umrah Overview",
    titleAr: "نَظْرَةٌ عَامَّةٌ لِلْحَجِّ وَالْعُمْرَةِ",
    titleUrdu: "حج اور عمرہ کا اجمالی جائزہ",
    icon: <FaQuestionCircle className="topic-icon" />,
    content: [
      {
        item: "Purpose & Significance:",
        description:
          "Hajj is the fifth pillar of Islam, a mandatory pilgrimage for every physically and financially able Muslim.",
        descriptionUrdu:
          "حج اسلام کا پانچواں رکن ہے، ہر جسمانی اور مالی طور پر استطاعت رکھنے والے مسلمان پر فرض ہے۔",
        itemAr: "الْغَرَضُ وَالْأَهَمِّيَّةُ:",
        descriptionAr:
          "الحج هو الركن الخامس من أركان الإسلام، وهي فريضة على كل مسلم قادر جسدياً ومالياً.",
        reference: "Qur'an 3:97",
        source: "Qur'an",
      },
      {
        item: "Difference: Hajj vs. Umrah:",
        description:
          "Hajj is performed only once a year during specific Islamic months, while Umrah can be performed at any time.",
        descriptionUrdu:
          "حج سال میں صرف ایک بار مخصوص اسلامی مہینوں میں ادا کیا جاتا ہے، جبکہ عمرہ کسی بھی وقت کیا جا سکتا ہے۔",
        itemAr: "الْفَرْقُ بَيْنَ الْحَجِّ وَالْعُمْرَةِ:",
        descriptionAr:
          "الحج يؤدى مرة واحدة في السنة في أشهر محددة، بينما يمكن أداء العمرة في أي وقت.",
        reference: "Sunan Ibn Majah 2883",
        source: "Hadith",
      },
      {
        item: "Timeline of Rituals:",
        description:
          "Hajj follows a strict timeline from the 8th to the 13th of Dhul Hijjah.",
        descriptionUrdu:
          "حج ذوالحجہ کی 8 تاریخ سے 13 تاریخ تک ایک سخت نظام الاوقات کی پیروی کرتا ہے۔",
        itemAr: "التَّسَلْسُلُ الزَّمَنِيُّ لِلْمَنَاسِكِ:",
        descriptionAr:
          "يتبع الحج تسلسلاً زمنياً دقيقاً من ٨ إلى ١٣ من ذي الحجة.",
        reference: "Sahih al-Bukhari 1651",
        source: "Hadith",
      },
    ],
  },
  preparation: {
    title: "Pilgrimage Preparation",
    titleAr: "اَلتَّحْضِيرُ لِلْحَجِّ",
    titleUrdu: "سفر حج کی تیاری",
    icon: <FaSuitcase className="topic-icon" />,
    content: [
      {
        item: "Physical Preparation:",
        description:
          "Ensuring good health, necessary vaccinations, and physical fitness for the demanding journey.",
        descriptionUrdu:
          "اچھی صحت، ضروری ویکسینیشن، اور جسمانی مشقت کے لیے فٹنس کو یقینی بنانا۔",
        itemAr: "اَلتَّحْضِيرُ الْجِسْمَانِيُّ:",
        descriptionAr:
          "ضَمَانُ الصِّحَّةِ الْجَيِّدَةِ وَأَخْذُ اللَّقَاحَاتِ الضَّرُورِيَّةِ وَاللِّيَاقَةُ الْبَدَنِيَّةُ.",
        reference: "Qur'an 2:197",
        source: "Qur'an",
      },
      {
        item: "Financial Preparation:",
        description:
          "Budgeting, ensuring permissible (Halal) funds, and arranging for the sacrificial animal (Qurbani).",
        descriptionUrdu:
          "بجٹ بنانا، حلال مال کو یقینی بنانا، اور قربانی کے جانور کا انتظام کرنا۔",
        itemAr: "التَّحْضِيرُ الْمَالِيُّ:",
        descriptionAr:
          "وَضْعُ الْمِيزَانِيَّةِ وَتَأْكِيدُ الْمَالِ الْحَلَالِ وَتَرْتِيبُ الْأُضْحِيَةِ.",
        reference: "Sahih al-Bukhari 1494",
        source: "Hadith",
      },
      {
        item: "Spiritual Preparation:",
        description:
          "Making sincere repentance (Tawbah), setting the pure intention (Niyyah), and practicing essential duas.",
        descriptionUrdu:
          "خالص توبہ کرنا، پاکیزہ نیت (نیّت) کرنا، اور ضروری دعاؤں کی مشق کرنا۔",
        itemAr: "التَّحْضِيرُ الرُّوحِيُّ:",
        descriptionAr:
          "التَّوْبَةُ النَّصُوحُ وَعَقْدُ النِّيَّةِ الصَّادِقَةِ وَمُمَارَسَةُ الْأَدْعِيَةِ الْأَسَاسِيَّةِ.",
        reference: "Sahih al-Bukhari 1",
        source: "Hadith",
      },
      {
        item: "Packing Checklist:",
        description:
          "Preparing Ihram garments, essential toiletries, and necessary medicines.",
        descriptionUrdu:
          "احرام کے کپڑے، ضروری بیت الخلاء کی اشیاء، اور لازمی دوائیں تیار کرنا۔",
        itemAr: "قَائِمَةُ حَقَائِبِ السَّفَرِ:",
        descriptionAr:
          "تَجْهِيزُ مَلَابِسِ الْإِحْرَامِ، وَالْمُنَظِّفَاتِ الضَّرُورِيَّةِ، وَالْأَدْوِيَةِ اللَّازِمَةِ.",
        reference: "Qur'an 2:197",
        source: "Qur'an",
      },
      {
        item: "Learning the Rites:",
        description:
          "Understanding the rituals and their significance before arriving to perform them correctly.",
        descriptionUrdu:
          "مناسک اور ان کی اہمیت کو سمجھنا تاکہ انہیں صحیح طریقے سے ادا کیا جا سکے۔",
        itemAr: "تَعَلُّمُ الْمَنَاسِكِ:",
        descriptionAr:
          "فَهْمُ الشَّعَائِرِ وَأَهَمِّيَّتِهَا قَبْلَ الْوُصُولِ لِأَدَائِهَا بِشَكْلٍ صَحِيحٍ.",
        reference: "Sahih Muslim 1297",
        source: "Hadith",
      },
    ],
  },
  rituals: {
    title: "Sacred Rituals",
    titleAr: "اَلْمَنَاسِكُ الْمُقَدَّسَةُ (خُطْوَةً بِخُطْوَةٍ)",
    titleUrdu: "مقدس مناسک ",
    icon: <FaKaaba className="topic-icon" />,
    content: [
      // NEW SECTION ADDED HERE
      {
        item: "Hajj Route Flow (8th to 12th Dhul Hijjah):",
        description:
          "A step-by-step physical journey that pilgrims follow outside Makkah, often referred to as the 'Five-Day Movement'. This is the movement between the holy sites: Makkah, Mina, Arafat, and Muzdalifah.",
        descriptionUrdu:
          "ایک مرحلہ وار جسمانی سفر جو حجاج مکہ کے باہر کرتے ہیں، جسے 'پانچ روزہ تحریک' بھی کہا جاتا ہے۔ یہ مقدس مقامات کے درمیان حرکت ہے: مکہ، منیٰ، عرفات، اور مزدلفہ۔",
        reference: "Sahih al-Bukhari 1651",
        source: "Hadith",
        // Custom component for the route flow - visually distinct
        hajjRoute: [
          {
            from: "Makkah (Masjid al-Haram)",
            to: "Mina",
            day: "8th Dhul Hijjah (Yawm al-Tarwiyah)",
            activity: "Start of Hajj, rest and prayer.",
            engDesc:
              "Pilgrims travel from Masjid al-Haram to Mina on the 8th of Dhul Hijjah. This marks the beginning of Hajj, where pilgrims spend the night in worship and preparation.",
            urduDesc:
              "حجاج 8 ذوالحجہ کو مسجد الحرام سے منٰی جاتے ہیں۔ یہ حج کا آغاز ہے، جہاں رات عبادت اور عرفات کی تیاری میں گزاری جاتی ہے",
          },
          {
            from: "Mina",
            to: "Arafat",
            day: "9th Dhul Hijjah (Yawm al-Arafah)",
            activity:
              "**Waqf al-Arafat (Standing)** - The Main Pillar of Hajj.",
            engDesc:
              "Pilgrims move from Mina to Arafat, where they perform Wuquf — the greatest and most essential pillar of Hajj spent in dua, repentance, and seeking Allah’s mercy.",
            urduDesc:
              "حجاج منٰی سے عرفات جاتے ہیں جہاں وقوف کیا جاتا ہے — جو حج کا سب سے اہم رکن ہے۔ یہاں دن دعا، توبہ اور اللہ کی رحمت طلب کرنے میں گزرتا ہے",
          },
          {
            from: "Arafat (after sunset)",
            to: "Muzdalifah",
            day: "Night of 10th Dhul Hijjah",
            activity:
              "Night stay, collecting pebbles, Maghrib & Isha prayers combined.",
            engDesc:
              "After sunset, pilgrims depart Arafat and stay overnight in Muzdalifah. They combine Maghrib and Isha, rest under the open sky, and collect pebbles for stoning.",
            urduDesc:
              "غروب آفتاب کے بعد حجاج عرفات سے مزدلفہ جاتے ہیں۔ یہاں کھلے آسمان تلے رات گزارتے ہیں، مغرب اور عشاء اکٹھی ادا کرتے ہیں، اور جمرات کے لیے کنکریاں جمع کرتے ہیں",
          },
          {
            from: "Muzdalifah (before sunrise)",
            to: "Mina",
            day: "10th Dhul Hijjah (Eid al-Adha)",
            activity: "Ramy al-Jamarat (Stoning), Sacrifice, and Haircut.",
            engDesc:
              "Pilgrims return to Mina before sunrise to perform the key rituals: stoning the Jamarat, sacrifice (Qurbani), and shaving or trimming the hair.",
            urduDesc:
              "حجاج فجر سے پہلے مزدلفہ سے منٰی واپس آتے ہیں تاکہ اہم مناسک ادا کریں: جمرات کو کنکریاں مارنا، قربانی کرنا، اور بال منڈوانا یا ترشوانا",
          },
          {
            from: "Mina (after rituals)",
            to: "Makkah (Masjid al-Haram)",
            day: "10th/11th Dhul Hijjah",
            activity: "**Tawaf al-Ifadah** (Essential Tawaf) and Sa'i.",

            engDesc:
              "After completing Mina rituals, pilgrims return to Makkah for Tawaf al-Ifadah and Sa’i — major compulsory acts signifying purification and completion of primary duties.",
            urduDesc:
              "مناسکِ منٰی مکمل کرنے کے بعد حجاج طوافِ افاضہ اور سعی کے لیے مکّہ واپس آتے ہیں۔ یہ حج کے بنیادی اور ضروری اعمال ہیں جو پاکیزگی اور اہم فرائض کی تکمیل کی علامت ہیں",
          },
        ],
      },
      // Existing rituals follow here...
      {
        item: "Ihram (8th Dhul Hijjah):",
        description:
          "Entering the sacred state of purity at the Miqat, abstaining from prohibited acts.",
        descriptionUrdu:
          "میقات پر پاکیزگی کی مقدس حالت میں داخل ہونا، ممنوعہ افعال سے پرہیز کرنا۔",
        itemAr: "اَلْإِحْرَامُ:",
        descriptionAr:
          "اَلدُّخُولُ فِي حَالَةِ الْإِحْرَامِ مِنَ الْمِيقَاتِ، وَالامْتِنَاعُ عَنِ الْمُحَرَّمَاتِ.",
        reference: "Sahih al-Bukhari 1542",
        source: "Hadith",
      },
      {
        item: "Tawaf (Qudum):",
        description:
          "Circumambulating the Kaaba seven times upon reaching Makkah.",
        descriptionUrdu: "مکہ پہنچنے پر کعبہ کے گرد سات چکر لگانا۔",
        itemAr: "اَلطَّوَافُ (الْقُدُومِ):",
        descriptionAr:
          "اَلطَّوَافُ حَوْلَ الْكَعْبَةِ سَبْعَ مَرَّاتٍ عِنْدَ الْوُصُولِ إِلَى مَكَّةَ.",
        reference: "Sahih al-Bukhari 1617",
        source: "Hadith",
      },
      {
        item: "Sa'i:",
        description:
          "Walking briskly between the hills of Safa and Marwa seven times, following the example of Hajar (AS).",
        descriptionUrdu:
          "صفا اور مروہ کے پہاڑوں کے درمیان سات بار تیزی سے چلنا، حضرت ہاجرہ (علیہ السلام) کی سنت کے مطابق۔",
        itemAr: "اَلسَّعْيُ:",
        descriptionAr:
          "اَلسَّعْيُ بَيْنَ الصَّفَا وَالْمَرْوَةِ سَبْعَ مَرَّاتٍ، اتِّبَاعًا لِسُنَّةِ هَاجَرَ عَلَيْهَا السَّلَامُ.",
        reference: "Qur'an 2:158",
        source: "Qur'an",
      },
      {
        item: "Standing at Arafat (9th Dhul Hijjah):",
        description:
          "The essential pillar (Rukn) of Hajj, spending the day in prayer, repentance, and reflection.",
        descriptionUrdu:
          "حج کا بنیادی رکن، دن کو دعا، توبہ اور غور و فکر میں گزارنا۔",
        itemAr: "الْوُقُوفُ بِعَرَفَةَ:",
        descriptionAr:
          "رُكْنُ الْحَجِّ الْأَعْظَمُ، قَضَاءُ النَّهَارِ فِي الدُّعَاءِ وَالتَّوْبَةِ وَالتَّأَمُّلِ.",
        reference: "Sunan al-Tirmidhi 889",
        source: "Hadith",
      },
      {
        item: "Muzdalifah Night Stay (9th/10th Dhul Hijjah):",
        description:
          "Collecting pebbles and spending the night in Muzdalifah, performing Maghrib and Isha prayers together.",
        descriptionUrdu:
          "مزدلفہ میں رات گزارنا، مغرب اور عشاء کی نمازیں ملا کر ادا کرنا، اور کنکریاں جمع کرنا۔",
        itemAr: "الْمَبِيتُ بِالْمُزْدَلِفَةِ:",
        descriptionAr:
          "قَضَاءُ اللَّيْلِ بِالْمُزْدَلِفَةِ، وَجَمْعُ الْحَصَى وَصَلَاةُ الْمَغْرِبِ وَالْعِشَاءِ مَعًا.",
        reference: "Sahih al-Bukhari 1682",
        source: "Hadith",
      },
      {
        item: "Ramy al-Jamarat (10th Dhul Hijjah):",
        description:
          "Stoning the great pillar (Jamarat al-Aqabah) in Mina on the Day of Sacrifice (Eid al-Adha).",
        descriptionUrdu:
          "یوم النحر (عید الاضحیٰ) کے دن منیٰ میں بڑے جمرہ (جمرہ عقبہ) کو کنکریاں مارنا۔",
        itemAr: "رَمْيُ الْجَمَرَاتِ:",
        descriptionAr:
          "رَمْيُ الْجَمْرَةِ الْكُبْرَى بِمِنًى فِي يَوْمِ النَّحْرِ (عِيدِ الْأَضْحَى).",
        reference: "Sahih Muslim 1296",
        source: "Hadith",
      },
      {
        item: "Animal Sacrifice (Qurbani):",
        description:
          "Offering the sacrifice, following the example of Prophet Ibrahim (AS).",
        descriptionUrdu:
          "قربانی پیش کرنا، حضرت ابراہیم (علیہ السلام) کی سنت پر عمل کرتے ہوئے۔",
        itemAr: "الْأُضْحِيَةُ:",
        descriptionAr:
          "تَقْدِيمُ الْأُضْحِيَةِ، اتِّبَاعًا لِسُنَّةِ إِبْرَاهِيمَ عَلَيْهِ السَّلَامُ.",
        reference: "Qur'an 22:36",
        source: "Qur'an",
      },
      {
        item: "Haircut/Shaving (Halq/Taqsir):",
        description:
          "The final step to exit Ihram, shaving the head (Halq) or trimming the hair (Taqsir).",
        descriptionUrdu:
          "احرام سے باہر آنے کا آخری مرحلہ، سر منڈوانا یا بال چھوٹے کروانا۔",
        itemAr: "الْحَلْقُ وَالتَّقْصِيرُ:",
        descriptionAr:
          "الْخُطْوَةُ الْأَخِيرَةُ لِلْخُرُوجِ مِنَ الْإِحْرَامِ، حَلْقُ الرَّأْسِ أَو تَقْصِيرُ الشَّعْرِ.",
        reference: "Sahih al-Bukhari 1727",
        source: "Hadith",
      },
      {
        item: "Tawaf al-Wada (Final Tawaf):",
        description:
          "The farewell circumambulation of the Kaaba before leaving Makkah (mandatory for non-residents).",
        descriptionUrdu:
          "مکہ چھوڑنے سے پہلے کعبہ کا الوداعی طواف (غیر رہائشیوں کے لیے فرض)۔",
        itemAr: "طَوَافُ الْوَدَاعِ:",
        descriptionAr:
          "طَوَافُ الْوَدَاعِ حَوْلَ الْكَعْبَةِ قَبْلَ مُغَادَرَةِ مَكَّةَ (وَاجِبٌ عَلَى غَيْرِ الْمُقِيمِ).",
        reference: "Sahih al-Bukhari 1755",
        source: "Hadith",
      },
    ],
  },
  duas: {
    title: "Essential Duas",
    titleAr: "اَلْأَدْعِيَةُ الْأَسَاسِيَّةُ",
    titleUrdu: "ضروری دعائیں",
    icon: <FaBookOpen className="topic-icon" />,
    content: [
      {
        item: "Dua for Traveling:",
        description:
          "Dua for safe journey as taught by Prophet Muhammad (PBUH).",
        descriptionUrdu: "نبی کریم ﷺ کی تعلیم کردہ سفر کی دعا۔",
        itemAr: "دُعَاءُ السَّفَرِ:",
        itemAr: "دُعَاءُ السَّفَرِ:",
        descriptionAr: "دُعَاءُ السَّفَرِ كَمَا عَلَّمَهُ النَّبِيُّ ﷺ.",
        arabic:
          "اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ",
        translation:
          "O Allah, make this journey easy for us and make its distance short for us. O Allah, You are the companion on the journey and the guardian of the family.",
        translationUrdu:
          "اے اللہ! ہمارے لیے اس سفر کو آسان کر دے اور اس کی مسافت کو ہمارے لیے کم کر دے۔ اے اللہ! تو سفر میں ساتھی ہے اور گھر والوں کا نگہبان ہے۔",
        reference: "Sahih Muslim 1342",
        source: "Hadith",
      },
      {
        item: "Talbiyah (During Ihram):",
        description:
          "The pilgrim's response to Allah's call, reciting this frequently during Ihram.",
        descriptionUrdu:
          "اللہ کی دعوت کا جواب، احرام کے دوران اسے کثرت سے پڑھنا۔",
        itemAr: "التَّلْبِيَةُ:",
        descriptionAr:
          "إِجَابَةُ دَعْوَةِ اللَّهِ، يُكْثِرُ الْحَاجُّ مِنْهَا أَثْنَاءَ الْإِحْرَامِ.",
        arabic:
          "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
        translation:
          "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Verily all praise and favor belong to You, and all sovereignty. You have no partner.",
        translationUrdu:
          "حاضر ہوں اے اللہ، حاضر ہوں۔ حاضر ہوں، تیرا کوئی شریک نہیں، حاضر ہوں۔ بے شک تمام تعریف اور نعمت تیری ہے اور بادشاہت بھی، تیرا کوئی شریک نہیں۔",
        reference: "Sahih Muslim 1184",
        source: "Hadith",
      },
      {
        item: "During Tawaf:",
        description:
          "The short but comprehensive supplication recited between the Yemeni Corner and the Black Stone.",
        descriptionUrdu:
          "رکن یمانی اور حجر اسود کے درمیان پڑھی جانے والی مختصر مگر جامع دعا۔",
        itemAr: "دُعَاءٌ أَثْنَاءَ الطَّوَافِ:",
        descriptionAr:
          "اَلدُّعَاءُ الْمُخْتَصَرُ وَالْجَامِعُ بَيْنَ الرُّكْنِ الْيَمَانِي وَالْحَجَرِ الْأَسْوَدِ.",
        arabic:
          "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        translation:
          "Our Lord! Give us good in this world and good in the next world, and save us from the punishment of the Fire.",
        translationUrdu:
          "اے ہمارے رب! ہمیں دنیا میں بھی بھلائی دے اور آخرت میں بھی بھلائی دے اور ہمیں آگ کے عذاب سے بچا۔",
        reference: "Qur'an 2:201",
        source: "Qur'an",
      },
      {
        item: "Sa'i Duas:",
        description:
          "Reciting specific remembrance when ascending Safa and Marwa.",
        descriptionUrdu: "صفا اور مروہ پر چڑھتے وقت مخصوص ذکر پڑھنا۔",
        itemAr: "أَدْعِيَةُ السَّعْيِ:",
        descriptionAr:
          "ذِكْرٌ مُحَدَّدٌ عِنْدَ الصُّعُودِ عَلَى الصَّفَا وَالْمَرْوَةِ.",
        arabic:
          "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        translation:
          "There is no deity except Allah, alone, without partner. To Him belongs dominion and to Him belongs praise, and He is over all things competent.",
        translationUrdu:
          "اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہت ہے اور اسی کے لیے تعریف ہے اور وہ ہر چیز پر قادر ہے۔",
        reference: "Sahih Muslim 1218",
        source: "Hadith",
      },
      {
        item: "Dua on Day of Arafat:",
        description: "The best supplication is the Dua of Arafat.",
        descriptionUrdu: "عرفہ کے دن کی دعا سب سے بہترین دعا ہے۔",
        itemAr: "دُعَاءُ يَوْمِ عَرَفَةَ:",
        descriptionAr: "خَيْرُ الدُّعَاءِ دُعَاءُ يَوْمِ عَرَفَةَ.",
        arabic:
          "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        translation:
          "There is no deity except Allah, alone, without partner. To Him belongs dominion and to Him belongs praise, and He is over all things competent.",
        translationUrdu:
          "اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہت ہے اور اسی کے لیے تعریف ہے اور وہ ہر چیز پر قادر ہے۔",
        reference: "Sunan al-Tirmidhi 3585",
        source: "Hadith",
      },
      {
        item: "Dua upon Returning Home:",
        description:
          "Expressing thankfulness and glorifying Allah upon returning from the journey.",
        descriptionUrdu:
          "سفر سے واپسی پر شکر گزاری کا اظہار اور اللہ کی تسبیح کرنا۔",
        itemAr: "دُعَاءُ الْعَوْدَةِ إِلَى الْوَطَنِ:",
        descriptionAr:
          "التَّعْبِيرُ عَنِ الشُّكْرِ وَتَمْجِيدُ اللَّهِ عِنْدَ الْعَوْدَةِ مِنَ السَّفَرِ.",
        arabic: "آيِبُونَ، تَائِبُونَ، عَابِدُونَ، لِرَبِّنَا حَامِدُونَ",
        translation:
          "Returning, repenting, worshipping, and praising our Lord.",
        translationUrdu:
          "واپس لوٹنے والے ہیں، توبہ کرنے والے ہیں، عبادت کرنے والے ہیں، اپنے رب کی تعریف کرنے والے ہیں۔",
        reference: "Sahih Muslim 1342",
        source: "Hadith",
      },
    ],
  },
  tips: {
    title: "Spiritual Guidelines",
    titleAr: "الْإِرْشَادَاتُ الرُّوحِيَّةُ",
    titleUrdu: "روحانی ہدایات",
    icon: <FaLightbulb className="topic-icon" />,
    content: [
      {
        item: "Patience and Perseverance:",
        description:
          "Remembering that Hajj is a test; patience leads to great reward.",
        descriptionUrdu:
          "یاد رکھیں کہ حج ایک آزمائش ہے؛ صبر عظیم اجر کی طرف لے جاتا ہے۔",
        itemAr: "الصَّبْرُ وَالْمُثَابَرَةُ:",
        descriptionAr:
          "اَلتَّذَكُّرُ بِأَنَّ الْحَجَّ اِبْتِلَاءٌ، وَالصَّبْرُ يُؤَدِّي إِلَى أَجْرٍ عَظِيمٍ.",
        arabic:
          "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ",
        translation:
          "And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient.",
        translationUrdu:
          "اور ہم ضرور تمہیں آزمائیں گے کسی قدر خوف اور بھوک سے اور مال اور جان اور پھلوں کی کمی سے، اور صبر کرنے والوں کو خوشخبری دے دو۔",
        reference: "Qur'an 2:155",
        source: "Qur'an",
      },
      {
        item: "Avoiding Disputes:",
        description:
          "Strictly avoiding all types of arguments, disputes, and negative behavior during Hajj.",
        descriptionUrdu:
          "حج کے دوران ہر طرح کے جھگڑوں، تنازعات اور منفی رویے سے سختی سے گریز کرنا۔",
        itemAr: "تَجَنُّبُ الْجِدَالِ:",
        descriptionAr:
          "اَلتَّجَنُّبُ الْقَاطِعُ لِجَمِيعِ أَنْوَاعِ الْجِدَالِ وَالْفُسُوقِ أَثْنَاءَ الْحَجِّ.",
        arabic: "فَلَا رَفَثَ وَلَا فُسُوقَ وَلَا جِدَالَ فِي الْحَجِّ",
        translation:
          "So whoever has made Hajj obligatory upon himself therein, there is no sexual relations and no disobedience and no disputing during Hajj.",
        translationUrdu:
          "پس جس نے اپنے اوپر حج لازم کر لیا تو حج میں کوئی شہوانی بات نہیں، کوئی نافرمانی نہیں اور کوئی جھگڑا نہیں۔",
        reference: "Qur'an 2:197",
        source: "Qur'an",
      },
      {
        item: "Humility and Reflection:",
        description:
          "Approaching the sacred journey with true humility, recognizing one's weakness before Allah.",
        descriptionUrdu:
          "عاجزی کے ساتھ مقدس سفر کا آغاز کرنا، اللہ کے سامنے اپنی کمزوری کو پہچاننا۔",
        itemAr: "التَّوَاضُعُ وَالتَّأَمُّلُ:",
        descriptionAr:
          "الاِقْتِرَابُ مِنَ الرِّحْلَةِ الْمُقَدَّسَةِ بِتَوَاضُعٍ حَقِيقِيٍّ وَتَأَمُّلٍ.",
        reference: "Sahih al-Bukhari 1773",
        source: "Hadith",
      },
      {
        item: "Sincere Repentance:",
        description:
          "Constantly seeking Allah's forgiveness and mercy; Hajj cleanses all previous sins.",
        descriptionUrdu:
          "مستقل طور پر اللہ کی مغفرت اور رحمت طلب کرنا؛ حج پچھلے تمام گناہوں کو دھو دیتا ہے۔",
        itemAr: "طَلَبُ الْمَغْفِرَةِ:",
        descriptionAr:
          "طَلَبُ مَغْفِرَةِ اللَّهِ وَرَحْمَتِهِ بِاسْتِمْرَارٍ؛ الْحَجُّ يَغْسِلُ جَمِيعَ الذُّنُوبِ السَّابِقَةِ.",
        reference: "Sahih al-Bukhari 1521",
        source: "Hadith",
      },
      {
        item: "Gratitude and Dhikr:",
        description:
          "Keeping the tongue moist with the remembrance of Allah and expressing gratitude.",
        descriptionUrdu:
          "زبان کو اللہ کے ذکر سے تر رکھنا اور شکر گزاری کا اظہار کرنا۔",
        itemAr: "الشُّكْرُ وَالذِّكْرُ:",
        descriptionAr:
          "إِبْقَاءُ اللِّسَانِ رَطْبًا بِذِكْرِ اللَّهِ وَالتَّعْبِيرُ عَنِ الشُّكْرِ.",
        reference: "Qur'an 2:200",
        source: "Qur'an",
      },
    ],
  },
};

// ====================================================================================
// Custom Hajj Route Component for clear visualization
// ====================================================================================

const HajjRouteFlow = ({ routeData }) => (
  <div className="space-y-4 pt-4">
    {routeData.map((step, index) => (
      <div key={index} className="flex items-start justify-between">
        {/* LEFT SIDE TIMELINE */}
        <div className="flex items-start">
          <div className="flex flex-col items-center mr-4">
            {/* Icon */}
            <FaMapMarkerAlt
              className={`text-3xl ${
                index === 0 ? "text-[#055160]" : "text-[#e0c33e]"
              }`}
            />

            {/* Line */}
            {index < routeData.length - 1 && (
              <div className="h-16 w-1 bg-[#055160]/50 my-1"></div>
            )}
          </div>

          {/* Main Content Card */}
          <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-[#e0c33e] w-[380px]">
            <p className="text-xl font-bold text-[#055160] mb-1">
              <span className="mr-2">Day/Date:</span> {step.day}
            </p>

            <div className="text-2xl font-extrabold text-[#033642] mb-2 flex items-center">
              {step.from}
              <FaChevronRight className="mx-3 text-[#e0c33e]" />
              {step.to}
            </div>

            <p className="text-gray-700 text-lg">
              <span className="font-semibold text-red-500">Main Activity:</span>{" "}
              {step.activity}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE DESCRIPTION BOX */}
        <div className="bg-[#fef9e7] p-4 rounded-xl shadow border border-[#e0c33e] w-[360px] ml-6">
          <h3 className="text-lg font-bold text-[#055160] mb-2">
            What is this step?
          </h3>

          {/* English Explanation */}
          <p className="text-gray-700 mb-3 text-sm leading-relaxed">
            {step.engDesc}
          </p>

          {/* Urdu Explanation */}
          <p className="text-gray-800 text-sm leading-relaxed font-medium">
            <span className="text-[#055160] font-bold">اردو:</span>{" "}
            {step.urduDesc}
          </p>
        </div>
      </div>
    ))}
  </div>
);

const HajjUmrah = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState(topic || "overview");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (topic && hajjTopics[topic]) {
      setActiveTopic(topic);
    } else if (topic !== "overview") {
      navigate("/learn/hajj/overview");
    }
  }, [topic, navigate]);

  const currentTopicData = hajjTopics[activeTopic] || hajjTopics.overview;

  // Function to render content item, including the new Hajj Route Flow
  const renderContentItem = (item, idx) => {
    const hasRoute = item.hajjRoute && activeTopic === "rituals";

    return (
      <div key={idx} className="bg-[#e0c33e]/10 rounded-xl p-6">
        <div className="flex justify-between items-start">
          {/* Left Side: English/Urdu */}
          <div>
            <strong className="text-3xl text-[#055160]">{item.item}</strong>
            <p className="text-gray-700 mt-3 text-xl">{item.description}</p>
            {item.descriptionUrdu && (
              <p className="text-gray-700 mt-1 font-urdu text-xl">
                {item.descriptionUrdu}
              </p>
            )}

            {/* Render the custom Hajj Route Flow component */}
            {hasRoute && <HajjRouteFlow routeData={item.hajjRoute} />}

            {/* English Translation */}
            {item.translation && (
              <p className="text-gray-700 mt-3 text-xl italic">
                {item.translation}
              </p>
            )}
            {/* Urdu Translation */}
            {item.translationUrdu && (
              <p className="text-gray-700 mt-1 font-urdu text-xl italic">
                {item.translationUrdu}
              </p>
            )}
            {/* Reference */}
            {item.reference && item.source && (
              <div className="text-lg text-gray-500 mt-1">
                <span className="font-semibold">{item.source}:</span>{" "}
                {item.reference}
              </div>
            )}
          </div>

          {/* Right Side: Arabic */}
          <div className="text-right" dir="rtl">
            <strong
              className="text-3xl text-[#055160]"
              style={{ fontFamily: "MUHAMMADIBOLD, serif" }}
            >
              {item.itemAr}
            </strong>
            <p
              className="text-gray-700 mt-3 text-xl"
              style={{ fontFamily: "MUHAMMADIBOLD, serif" }}
            >
              {item.descriptionAr}
            </p>
            {item.arabic && (
              <p
                className="text-gray-700 mt-3 text-xl"
                style={{ fontFamily: "MUHAMMADIBOLD, serif" }}
              >
                {item.arabic}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#ffffff]/10 mt-10">
      <Navbar />
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-2 md:px-8 gap-8 flex-1 mt-10">
        {/* Back Button */}
        <div className="md:w-auto flex items-start pt-6">
          <button
            onClick={() => navigate("/learning-path")}
            className="bg-white/90 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-[#e0c33e]/10 group"
            title="Back to Learning Path"
          >
            <FaArrowLeft className="text-[#055160] text-xl group-hover:text-[#033642] transition-colors" />
          </button>
        </div>

        {/* Sidebar */}
        <aside className="md:w-1/3 lg:w-1/4 py-6">
          <div className="bg-white/90 p-4 rounded-2xl shadow-xl">
            <h3 className="text-xl font-extrabold text-[#055160] mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-8 bg-gradient-to-b from-[#e0c33e] to-[#055160] rounded-full"></span>
              Hajj & Umrah Guide
            </h3>
            <ul className="space-y-2">
              {Object.keys(hajjTopics).map((topicKey) => (
                <li key={topicKey}>
                  <Link
                    to={`/learn/hajj/${topicKey}`}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors duration-200 font-semibold border-2 shadow-sm h-[89px]
                      ${
                        activeTopic === topicKey
                          ? "bg-gradient-to-br from-[#e0c33e]/80 to-[#055160]/80 text-[#033642] border-[#e0c33e] shadow-lg"
                          : "bg-white border-[#055160]/10 text-[#055160] hover:bg-[#e0c33e]/10 hover:text-[#055160]"
                      }
                    `}
                  >
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2">
                        {hajjTopics[topicKey].icon}
                        {topicKey === "overview" ? (
                          <span className="font-semibold">
                            Hajj &<br />
                            Umrah
                            <br />
                            Overview
                          </span>
                        ) : topicKey === "preparation" ? (
                          <span className="font-semibold">
                            Pilgrimage
                            <br />
                            Preparation
                          </span>
                        ) : topicKey === "rituals" ? (
                          <span className="font-semibold">
                            Sacred
                            <br />
                            Rituals
                          </span>
                        ) : topicKey === "duas" ? (
                          <span className="font-semibold">
                            Essential
                            <br />
                            Duas
                          </span>
                        ) : topicKey === "tips" ? (
                          <span className="font-semibold">
                            Spiritual
                            <br />
                            Guidelines
                          </span>
                        ) : (
                          <span className="font-semibold">
                            {hajjTopics[topicKey].title}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="font-semibold text-right font-urdu">
                        {hajjTopics[topicKey].titleUrdu}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:w-2/3 lg:w-3/4 py-6">
          <div className="bg-gradient-to-br from-[#033642]/10 to-[#e0c33e]/10 rounded-2xl shadow-xl p-8">
            {/* Topic Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-extrabold text-[#055160]">
                  {currentTopicData.title}
                </h2>
                <h3 className="text-xl font-bold text-[#055160] mt-2 font-urdu">
                  {currentTopicData.titleUrdu}
                </h3>
              </div>
              <div className="text-right" dir="rtl">
                <h2
                  className="text-3xl font-extrabold text-[#055160]"
                  style={{ fontFamily: "MUHAMMADIBOLD, serif" }}
                >
                  {currentTopicData.titleAr}
                </h2>
              </div>
            </div>

            {/* Topic Details */}
            <div className="topic-details">
              <div className="space-y-6">
                {/* Rendering content items using the new function */}
                {currentTopicData.content.map(renderContentItem)}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default HajjUmrah;
