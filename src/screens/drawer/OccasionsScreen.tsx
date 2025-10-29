import {useNavigation} from '@react-navigation/native';
import React, {useState, useMemo, useCallback, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Svg, {Path, Circle, Rect} from 'react-native-svg';
import {WebView} from 'react-native-webview';

const {width, height} = Dimensions.get('window');

const AppColors = {
  primary: '#7dd3c0',
  black: '#000000',
  white: '#ffffff',
  gray: '#666666',
  dark: '#2a2a2a',
  teal: '#1e6b5c',
  cream: '#f5f5dc',
  lightGray: '#f8f9fa',
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  orange: '#f97316',
  cardBg: '#1a1a1a',
  pink: '#ec4899',
};

// SVG Icons for main categories
const FamilyIcon = ({size = 40, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="20" r="8" fill={AppColors.warning} />
    <Path d="M20 50C20 42 25 38 32 38S44 42 44 50" fill={AppColors.warning} />
    <Circle cx="20" cy="25" r="4" fill={AppColors.warning} opacity="0.7" />
    <Circle cx="44" cy="25" r="4" fill={AppColors.warning} opacity="0.7" />
  </Svg>
);

const BabyIcon = ({size = 40, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="24" r="12" fill={AppColors.blue} />
    <Circle cx="28" cy="20" r="2" fill={AppColors.white} />
    <Circle cx="36" cy="20" r="2" fill={AppColors.white} />
    <Path
      d="M28 28C30 30 34 30 36 28"
      stroke={AppColors.white}
      strokeWidth="2"
      fill="none"
    />
    <Rect x="26" y="36" width="12" height="20" rx="6" fill={AppColors.blue} />
  </Svg>
);

const BoysMarriageIcon = ({size = 40, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="26" cy="20" r="8" fill={AppColors.orange} />
    <Path d="M16 45C16 40 20 36 26 36S36 40 36 45" fill={AppColors.orange} />
    <Circle cx="40" cy="22" r="6" fill={AppColors.pink} opacity="0.7" />
    <Path d="M30 32L42 32" stroke={color} strokeWidth="3" />
    <Circle cx="36" cy="32" r="3" fill={color} />
  </Svg>
);

const GirlsMarriageIcon = ({size = 40, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="20" r="8" fill={AppColors.purple} />
    <Path d="M22 45C22 40 26 36 32 36S42 40 42 45" fill={AppColors.purple} />
    <Path
      d="M26 14C26 10 28 8 32 8S38 10 38 14"
      stroke={AppColors.purple}
      strokeWidth="2"
      fill="none"
    />
    <Circle cx="28" cy="12" r="2" fill={AppColors.purple} />
    <Circle cx="36" cy="12" r="2" fill={AppColors.purple} />
  </Svg>
);

const DeathIcon = ({size = 40, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Rect x="24" y="20" width="16" height="32" rx="2" fill={AppColors.gray} />
    <Rect x="20" y="16" width="24" height="8" rx="4" fill={AppColors.gray} />
    <Path
      d="M28 24L28 44M36 24L36 44M32 28L32 40"
      stroke={AppColors.white}
      strokeWidth="1"
    />
  </Svg>
);

const PdfIcon = ({size = 24, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
      fill={color}
    />
  </Svg>
);

const ImageIcon = ({size = 24, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"
      fill={color}
    />
  </Svg>
);

const BackIcon = ({size = 24, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19L5 12L12 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CloseIcon = ({size = 24, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
      fill={color}
    />
  </Svg>
);

const GridIcon = ({size = 16, color = AppColors.gray}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10,4V8H14V4H10M16,4V8H20V4H16M16,10V14H20V10H16M16,16V20H20V16H16M14,20V16H10V20H14M8,20V16H4V20H8M8,14V10H4V14H8M8,8V4H4V8H8M10,14H14V10H10V14Z"
      fill={color}
    />
  </Svg>
);

// Data structures
interface OccasionCategory {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  subFilters: SubFilter[];
}

interface SubFilter {
  id: string;
  name: string;
  description: string;
  itemCount: number;
}

interface OccasionItem {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  subCategory: string;
  type: 'pdf' | 'image';
  url: string;
  thumbnailUrl?: string;
  language: string;
}

const occasionCategories: OccasionCategory[] = [
  {
    id: 'family-deities',
    title: 'Family Deities',
    icon: FamilyIcon,
    description: 'Family deity worship and rituals',
    color: AppColors.warning,
    subFilters: [
      {
        id: 'ganesh',
        name: 'Lord Ganesh',
        description: 'Ganesh puja and rituals',
        itemCount: 15,
      },
      {
        id: 'shiva',
        name: 'Lord Shiva',
        description: 'Shiva worship and ceremonies',
        itemCount: 12,
      },
      {
        id: 'vishnu',
        name: 'Lord Vishnu',
        description: 'Vishnu prayers and festivals',
        itemCount: 18,
      },
      {
        id: 'devi',
        name: 'Devi Mata',
        description: 'Goddess worship rituals',
        itemCount: 10,
      },
      {
        id: 'hanuman',
        name: 'Hanuman Ji',
        description: 'Hanuman prayers and offerings',
        itemCount: 8,
      },
    ],
  },
  {
    id: 'birth-naming',
    title: 'Birth Details / Naming',
    icon: BabyIcon,
    description: 'Birth ceremonies and naming rituals',
    color: AppColors.blue,
    subFilters: [
      {
        id: 'jatakarma',
        name: 'Jatakarma',
        description: 'Birth ceremony rituals',
        itemCount: 6,
      },
      {
        id: 'namkaran',
        name: 'Namkaran',
        description: 'Naming ceremony procedures',
        itemCount: 8,
      },
      {
        id: 'cradle',
        name: 'Cradle Ceremony',
        description: 'Baby cradle rituals',
        itemCount: 5,
      },
      {
        id: 'mundan',
        name: 'Mundan',
        description: 'First haircut ceremony',
        itemCount: 7,
      },
      {
        id: 'annaprashan',
        name: 'Annaprashan',
        description: 'First feeding ceremony',
        itemCount: 4,
      },
    ],
  },
  {
    id: 'boys-marriage',
    title: 'Boys Marriage',
    icon: BoysMarriageIcon,
    description: 'Male marriage ceremonies and rituals',
    color: AppColors.orange,
    subFilters: [
      {
        id: 'engagement',
        name: 'Engagement',
        description: 'Engagement ceremony rituals',
        itemCount: 10,
      },
      {
        id: 'mehendi',
        name: 'Mehendi',
        description: 'Pre-wedding celebrations',
        itemCount: 8,
      },
      {
        id: 'haldi',
        name: 'Haldi Ceremony',
        description: 'Turmeric application ritual',
        itemCount: 6,
      },
      {
        id: 'wedding',
        name: 'Wedding',
        description: 'Main marriage ceremony',
        itemCount: 20,
      },
      {
        id: 'reception',
        name: 'Reception',
        description: 'Post-wedding reception',
        itemCount: 5,
      },
    ],
  },
  {
    id: 'girls-marriage',
    title: 'Girls Marriage',
    icon: GirlsMarriageIcon,
    description: 'Female marriage ceremonies and rituals',
    color: AppColors.purple,
    subFilters: [
      {
        id: 'engagement',
        name: 'Engagement',
        description: 'Engagement ceremony rituals',
        itemCount: 12,
      },
      {
        id: 'mehendi',
        name: 'Mehendi',
        description: 'Henna ceremony traditions',
        itemCount: 15,
      },
      {
        id: 'sangeet',
        name: 'Sangeet',
        description: 'Music and dance celebrations',
        itemCount: 10,
      },
      {
        id: 'haldi',
        name: 'Haldi Ceremony',
        description: 'Turmeric ritual for bride',
        itemCount: 8,
      },
      {
        id: 'wedding',
        name: 'Wedding',
        description: 'Bride marriage ceremony',
        itemCount: 25,
      },
      {
        id: 'bidai',
        name: 'Bidai',
        description: 'Farewell ceremony',
        itemCount: 6,
      },
    ],
  },
  {
    id: 'death-details',
    title: 'Death details',
    icon: DeathIcon,
    description: 'Death rituals and last rites',
    color: AppColors.gray,
    subFilters: [
      {
        id: 'antim-sanskar',
        name: 'Antim Sanskar',
        description: 'Last rites ceremony',
        itemCount: 8,
      },
      {
        id: 'teras',
        name: 'Teras (13th day)',
        description: '13th day ritual',
        itemCount: 6,
      },
      {
        id: 'shradh',
        name: 'Shradh',
        description: 'Annual remembrance ritual',
        itemCount: 10,
      },
      {
        id: 'pitra-paksh',
        name: 'Pitra Paksh',
        description: 'Ancestral fortnight',
        itemCount: 7,
      },
      {
        id: 'barsi',
        name: 'Barsi',
        description: 'Annual death anniversary',
        itemCount: 5,
      },
    ],
  },
];

const occasionItems: OccasionItem[] = [
  // Family Deities - Ganesh
  {
    id: '1',
    title: 'Ganesh Chaturthi Puja Vidhi',
    author: 'Pandit Sharma',
    description:
      'Complete procedure for Ganesh Chaturthi celebration with step by step guide including materials needed, mantras, and procedures.',
    category: 'family-deities',
    subCategory: 'ganesh',
    type: 'pdf',
    url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    language: 'Hindi',
  },
  {
    id: '2',
    title: 'Ganesh Aarti Collection',
    author: 'Temple Authority',
    description:
      'Beautiful collection of Ganesh aartis with musical notations and proper pronunciation guide.',
    category: 'family-deities',
    subCategory: 'ganesh',
    type: 'image',
    url: 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    thumbnailUrl:
      'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    language: 'Sanskrit',
  },
  {
    id: '3',
    title: 'Weekly Ganesh Puja Guide',
    author: 'Dharmic Society',
    description:
      'Simple weekly worship procedures for Lord Ganesh with daily routines and special Tuesday rituals.',
    category: 'family-deities',
    subCategory: 'ganesh',
    type: 'pdf',
    url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    language: 'Hindi',
  },

  // Family Deities - Shiva
  {
    id: '4',
    title: 'Shiva Mahashivratri Puja',
    author: 'Pandit Gupta',
    description:
      'Detailed guide for Mahashivratri celebration including fasting rules, puja vidhi and night vigil procedures.',
    category: 'family-deities',
    subCategory: 'shiva',
    type: 'pdf',
    url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    language: 'Hindi',
  },
  {
    id: '5',
    title: 'Rudra Abhishek Chart',
    author: 'Temple Committee',
    description:
      'Visual guide for performing Rudra Abhishek with proper materials and mantras arrangement.',
    category: 'family-deities',
    subCategory: 'shiva',
    type: 'image',
    url: 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    thumbnailUrl:
      'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    language: 'Sanskrit',
  },

  // Birth & Naming
  {
    id: '6',
    title: 'Namkaran Sanskar Complete Guide',
    author: 'Pandit Verma',
    description:
      'Traditional naming ceremony procedures with astrological considerations and ritual guidelines.',
    category: 'birth-naming',
    subCategory: 'namkaran',
    type: 'pdf',
    url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    language: 'Hindi',
  },
  {
    id: '7',
    title: 'Baby Name Suggestions Chart',
    author: 'Astrology Center',
    description:
      'Comprehensive chart of auspicious names based on birth stars and lunar months.',
    category: 'birth-naming',
    subCategory: 'namkaran',
    type: 'image',
    url: 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    thumbnailUrl:
      'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    language: 'Hindi',
  },
  {
    id: '8',
    title: 'Jatakarma Ritual Procedures',
    author: 'Dharmic Council',
    description:
      'Birth ceremony rituals to be performed immediately after child birth including protective mantras.',
    category: 'birth-naming',
    subCategory: 'jatakarma',
    type: 'pdf',
    url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    language: 'Sanskrit',
  },

  // Boys Marriage
  {
    id: '9',
    title: 'Groom Wedding Ceremony Guide',
    author: 'Marriage Bureau',
    description:
      'Complete guide for groom side wedding preparations including pre-wedding rituals and main ceremony.',
    category: 'boys-marriage',
    subCategory: 'wedding',
    type: 'pdf',
    url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    language: 'Hindi',
  },
  {
    id: '10',
    title: 'Haldi Ceremony Decorations',
    author: 'Event Planner',
    description:
      'Beautiful decoration ideas and arrangements for grooms haldi ceremony with traditional elements.',
    category: 'boys-marriage',
    subCategory: 'haldi',
    type: 'image',
    url: 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    thumbnailUrl:
      'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    language: 'Visual',
  },

  // Girls Marriage
  {
    id: '11',
    title: 'Bride Wedding Rituals Manual',
    author: 'Wedding Consultant',
    description:
      'Comprehensive guide for bride side wedding ceremonies including mehendi, sangeet and main wedding.',
    category: 'girls-marriage',
    subCategory: 'wedding',
    type: 'pdf',
    url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    language: 'Hindi',
  },
  {
    id: '12',
    title: 'Mehendi Designs Collection',
    author: 'Mehendi Artist',
    description:
      'Traditional and modern mehendi designs for brides with step-by-step application guide.',
    category: 'girls-marriage',
    subCategory: 'mehendi',
    type: 'image',
    url: 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    thumbnailUrl:
      'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    language: 'Visual',
  },

  // Death Details
  {
    id: '13',
    title: 'Antim Sanskar Procedures',
    author: 'Pandit Association',
    description:
      'Complete guide for last rites ceremony including preparation, rituals and post-cremation procedures.',
    category: 'death-details',
    subCategory: 'antim-sanskar',
    type: 'pdf',
    url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    language: 'Hindi',
  },
  {
    id: '14',
    title: 'Teras Ritual Guidelines',
    author: 'Religious Council',
    description:
      'Detailed procedures for 13th day ceremony after death including donations and ritual requirements.',
    category: 'death-details',
    subCategory: 'teras',
    type: 'pdf',
    url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    language: 'Sanskrit',
  },
  {
    id: '15',
    title: 'Shradh Ceremony Chart',
    author: 'Dharmic Society',
    description:
      'Visual guide for annual shradh ceremony with proper dates, materials and procedure flow.',
    category: 'death-details',
    subCategory: 'shradh',
    type: 'image',
    url: 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    thumbnailUrl:
      'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    language: 'Hindi',
  },
];

const typeFilters = ['All', 'PDF', 'Image'];

const getCategoryColor = (categoryId: string) => {
  const category = occasionCategories.find(cat => cat.id === categoryId);
  return category?.color || AppColors.gray;
};

// PDF Modal Component - Extracted outside to prevent recreation
const PdfModalComponent = React.memo(
  ({
    visible,
    selectedItem,
    onClose,
  }: {
    visible: boolean;
    selectedItem: OccasionItem | null;
    onClose: () => void;
  }) => {
    const getPdfViewerUrl = (pdfUrl: string) => {
      return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
        pdfUrl,
      )}`;
    };

    return (
      <Modal
        visible={visible}
        transparent={false}
        animationType="slide"
        onRequestClose={onClose}>
        <View style={styles.pdfModalContainer}>
          <StatusBar
            backgroundColor={AppColors.teal}
            barStyle="light-content"
          />
          <View style={styles.pdfModalHeader}>
            <View style={styles.pdfHeaderContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.pdfModalTitle} numberOfLines={1}>
                  {selectedItem?.title}
                </Text>
                <Text style={styles.viewerLabel}>
                  📖 View-only • No downloads
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.pdfCloseButton}>
                <CloseIcon size={24} color={AppColors.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.pdfContent}>
            {selectedItem && (
              <WebView
                source={{uri: getPdfViewerUrl(selectedItem.url)}}
                style={styles.webView}
                startInLoadingState={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                injectedJavaScript={`
                  function hideUIElements() {
                    const elementsToHide = [
                      '#toolbarContainer',
                      '#sidebarContainer', 
                      '#secondaryToolbar',
                      '.toolbar',
                      '.findbar',
                      '#errorWrapper',
                      '#overlayContainer',
                      '.doorHanger',
                      '.dropdownToolbarButton',
                      '#pageNumberLabel',
                      '#scaleSelectContainer',
                      '#loadingBar'
                    ];
                    
                    const style = document.createElement('style');
                    style.innerHTML = elementsToHide.join(', ') + \` { 
                      display: none !important; 
                      visibility: hidden !important;
                      opacity: 0 !important;
                    }\` + \`
                    #viewerContainer { 
                      top: 0 !important; 
                      bottom: 0 !important; 
                      left: 0 !important; 
                      right: 0 !important;
                      overflow-y: auto !important;
                      background: #f0f0f0 !important;
                    }
                    #viewer {
                      padding: 10px !important;
                      background: #f0f0f0 !important;
                    }
                    .page {
                      margin: 10px auto !important;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
                      border-radius: 8px !important;
                    }
                    html, body { 
                      margin: 0 !important; 
                      padding: 0 !important; 
                      background: #f0f0f0 !important;
                      overflow: hidden !important;
                    }
                    \`;
                    document.head.appendChild(style);
                    
                    elementsToHide.forEach(selector => {
                      const elements = document.querySelectorAll(selector);
                      elements.forEach(el => {
                        if (el) {
                          el.style.display = 'none';
                          el.remove();
                        }
                      });
                    });
                    
                    document.addEventListener('contextmenu', function(e) {
                      e.preventDefault();
                      return false;
                    }, true);
                  }
                  
                  hideUIElements();
                  setTimeout(hideUIElements, 500);
                  setTimeout(hideUIElements, 1000);
                  setTimeout(hideUIElements, 2000);
                  
                  document.addEventListener('DOMContentLoaded', hideUIElements);
                  window.addEventListener('load', hideUIElements);
                  
                  true;
                `}
                renderLoading={() => (
                  <View style={styles.loadingContainer}>
                    <View style={styles.loadingSpinner}>
                      <Text style={styles.loadingEmoji}>📖</Text>
                    </View>
                    <Text style={styles.loadingText}>Loading Document...</Text>
                  </View>
                )}
                onError={() => {
                  Alert.alert('Error', 'Unable to load document');
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    );
  },
);

// Main View Component - Extracted outside to prevent recreation
const MainViewComponent = React.memo(
  ({
    handleCategorySelect,
    goBackToDrawer,
  }: {
    handleCategorySelect: (category: OccasionCategory) => void;
    goBackToDrawer: () => void;
  }) => {
    const CategoryCard = ({category}: {category: OccasionCategory}) => {
      const IconComponent = category.icon;
      const totalItems = occasionItems.filter(
        item => item?.category === category?.id,
      ).length;

      return (
        <TouchableOpacity
          style={[styles.categoryCard, {borderLeftColor: category.color}]}
          onPress={() => handleCategorySelect(category)}
          activeOpacity={0.8}>
          <View
            style={[styles.iconContainer, {backgroundColor: category.color}]}>
            <IconComponent size={40} color={AppColors.white} />
          </View>

          <View style={styles.categoryContent}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryDescription} numberOfLines={2}>
              {category.description}
            </Text>
            <View style={styles.itemCountContainer}>
              <Text style={styles.itemCountText}>
                {totalItems} items • {category.subFilters.length} categories
              </Text>
            </View>
          </View>

          <View style={styles.chevronContainer}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 18L15 12L9 6"
                stroke={AppColors.gray}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <>
        <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />

        <View style={styles.header}>
          <TouchableOpacity onPress={goBackToDrawer} style={styles.backButton}>
            <BackIcon size={24} color={AppColors.white} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Occasions</Text>
            <Text style={styles.headerSubtitle}>
              Choose a category to explore
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{occasionCategories.length}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{occasionItems.length}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {occasionItems.filter(i => i.type === 'pdf').length}
            </Text>
            <Text style={styles.statLabel}>PDFs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {occasionItems.filter(i => i.type === 'image').length}
            </Text>
            <Text style={styles.statLabel}>Images</Text>
          </View>
        </View>

        <ScrollView
          style={styles.categoriesContainer}
          showsVerticalScrollIndicator={false}>
          {occasionCategories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Select a category above to explore religious ceremonies and
              rituals
            </Text>
          </View>
        </ScrollView>
      </>
    );
  },
);

// Image Modal Component - Extracted outside to prevent recreation
const ImageModalComponent = React.memo(
  ({
    visible,
    selectedItem,
    onClose,
  }: {
    visible: boolean;
    selectedItem: OccasionItem | null;
    onClose: () => void;
  }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <StatusBar backgroundColor="rgba(0,0,0,0.9)" barStyle="light-content" />
        <View style={styles.modalHeader}>
          <View style={styles.modalHeaderContent}>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {selectedItem?.title}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <CloseIcon size={24} color={AppColors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.imageModalContent}>
          {selectedItem && (
            <Image
              source={{uri: selectedItem.url}}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={styles.modalFooter}>
          <Text style={styles.modalFooterText}>{selectedItem?.author}</Text>
        </View>
      </View>
    </Modal>
  ),
);

const OccasionsScreenComponent = () => {
  const goBackToDrawerRef = useRef<(() => void) | null>(null);
  const goBackToDrawer = () => {
    if (goBackToDrawerRef.current) {
      goBackToDrawerRef.current();
    }
  };
  const [currentView, setCurrentView] = useState<
    'main' | 'subfilters' | 'details'
  >('main');
  const [selectedCategory, setSelectedCategory] =
    useState<OccasionCategory | null>(null);
  const [selectedSubFilter, setSelectedSubFilter] = useState<SubFilter | null>(
    null,
  );
  const [selectedType, setSelectedType] = useState('All');
  const [selectedItem, setSelectedItem] = useState<OccasionItem | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  const navigation = useNavigation();

  // Filter items based on selected category, sub-filter and type - MEMOIZED
  const filteredItems = useMemo(() => {
    return occasionItems.filter(item => {
      const categoryMatch = selectedCategory
        ? item.category === selectedCategory.id
        : true;
      const subFilterMatch = selectedSubFilter
        ? item.subCategory === selectedSubFilter.id
        : true;
      const typeMatch =
        selectedType === 'All' ||
        (selectedType === 'PDF' && item.type === 'pdf') ||
        (selectedType === 'Image' && item.type === 'image');
      return categoryMatch && subFilterMatch && typeMatch;
    });
  }, [selectedCategory, selectedSubFilter, selectedType]);

  const handleCategorySelect = useCallback((category: OccasionCategory) => {
    setSelectedCategory(category);
    setCurrentView('subfilters');
    setSelectedSubFilter(null);
    setSelectedType('All');
  }, []);

  const handleSubFilterSelect = useCallback((subFilter: SubFilter) => {
    setSelectedSubFilter(subFilter);
    setCurrentView('details');
    setSelectedType('All');
  }, []);

  const handleBackToMain = useCallback(() => {
    setCurrentView('main');
    setSelectedCategory(null);
    setSelectedSubFilter(null);
    setSelectedType('All');
  }, []);

  const handleBackToSubFilters = useCallback(() => {
    setCurrentView('subfilters');
    setSelectedSubFilter(null);
    setSelectedType('All');
  }, []);

  const openItem = useCallback((item: OccasionItem) => {
    setSelectedItem(item);
    if (item.type === 'image') {
      setImageModalVisible(true);
    } else {
      setPdfModalVisible(true);
    }
  }, []);

  const closeModals = useCallback(() => {
    setImageModalVisible(false);
    setPdfModalVisible(false);
    setSelectedItem(null);
  }, []);

  // Sub-filters View
  const SubFiltersView = () => {
    const SubFilterCard = ({subFilter}: {subFilter: SubFilter}) => {
      const itemsInSubFilter = occasionItems.filter(
        item =>
          item.category === selectedCategory?.id &&
          item.subCategory === subFilter.id,
      ).length;

      return (
        <TouchableOpacity
          style={[
            styles.subFilterCard,
            {borderLeftColor: selectedCategory?.color},
          ]}
          onPress={() => handleSubFilterSelect(subFilter)}
          activeOpacity={0.8}>
          <View style={styles.subFilterContent}>
            <Text style={styles.subFilterTitle}>{subFilter.name}</Text>
            <Text style={styles.subFilterDescription}>
              {subFilter.description}
            </Text>
            <Text style={styles.subFilterCount}>
              {itemsInSubFilter} items available
            </Text>
          </View>

          <View style={styles.chevronContainer}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 18L15 12L9 6"
                stroke={AppColors.gray}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <>
        <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />

        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBackToMain}
            style={styles.backButton}>
            <BackIcon size={24} color={AppColors.white} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{selectedCategory?.title}</Text>
            <Text style={styles.headerSubtitle}>
              Select a specific category
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {selectedCategory?.subFilters.length || 0}
            </Text>
            <Text style={styles.statLabel}>Sub Categories</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {
                occasionItems.filter(
                  item => item.category === selectedCategory?.id,
                ).length
              }
            </Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {
                occasionItems.filter(
                  item =>
                    item.category === selectedCategory?.id &&
                    item.type === 'pdf',
                ).length
              }
            </Text>
            <Text style={styles.statLabel}>PDFs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {
                occasionItems.filter(
                  item =>
                    item.category === selectedCategory?.id &&
                    item.type === 'image',
                ).length
              }
            </Text>
            <Text style={styles.statLabel}>Images</Text>
          </View>
        </View>

        <ScrollView
          style={styles.categoriesContainer}
          showsVerticalScrollIndicator={false}>
          {selectedCategory?.subFilters.map(subFilter => (
            <SubFilterCard key={subFilter.id} subFilter={subFilter} />
          ))}
        </ScrollView>
      </>
    );
  };

  // Details View
  const DetailsView = () => {
    const TypeFilter = () => (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.typeFilterContainer}
        contentContainerStyle={styles.filterContent}>
        {typeFilters.map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              selectedType === type && styles.typeButtonActive,
            ]}
            onPress={() => setSelectedType(type)}>
            <View style={styles.typeIcon}>
              {type === 'PDF' && (
                <PdfIcon
                  size={16}
                  color={
                    selectedType === type ? AppColors.white : AppColors.gray
                  }
                />
              )}
              {type === 'Image' && (
                <ImageIcon
                  size={16}
                  color={
                    selectedType === type ? AppColors.white : AppColors.gray
                  }
                />
              )}
              {type === 'All' && (
                <GridIcon
                  size={16}
                  color={
                    selectedType === type ? AppColors.white : AppColors.gray
                  }
                />
              )}
            </View>
            <Text
              style={[
                styles.typeButtonText,
                selectedType === type && styles.typeButtonTextActive,
              ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );

    const ItemCard = ({item}: {item: OccasionItem}) => (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() => openItem(item)}
        activeOpacity={0.8}>
        <View style={styles.itemHeader}>
          <View
            style={[
              styles.typeIndicator,
              {backgroundColor: getCategoryColor(item.category)},
            ]}>
            {item.type === 'pdf' ? (
              <PdfIcon size={24} color={AppColors.white} />
            ) : (
              <ImageIcon size={24} color={AppColors.white} />
            )}
          </View>
        </View>

        {item.type === 'image' && item.thumbnailUrl && (
          <View style={styles.imagePreview}>
            <Image
              source={{uri: item.thumbnailUrl}}
              style={styles.previewImage}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.authorName}>{item.author}</Text>
          <Text style={styles.itemDescription} numberOfLines={3}>
            {item.description}
          </Text>

          <View style={styles.itemFooter}>
            <Text style={styles.languageText}>{item.language}</Text>
            <View
              style={[
                styles.typeBadge,
                {backgroundColor: getCategoryColor(item.category)},
              ]}>
              <Text style={styles.typeBadgeText}>
                {item.type.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBackToSubFilters}
            style={styles.backButton}>
            <BackIcon size={24} color={AppColors.white} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{selectedSubFilter?.name}</Text>
            <Text style={styles.headerSubtitle}>{selectedCategory?.title}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{filteredItems.length}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {filteredItems.filter(i => i.type === 'pdf').length}
            </Text>
            <Text style={styles.statLabel}>PDFs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {filteredItems.filter(i => i.type === 'image').length}
            </Text>
            <Text style={styles.statLabel}>Images</Text>
          </View>
        </View>

        <TypeFilter />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styles.itemsGrid}>
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </View>

          {filteredItems.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Items Found</Text>
              <Text style={styles.emptyText}>
                No content available for this category and filter combination.
              </Text>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Documents and guides related to {selectedSubFilter?.name}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  };

  // Render the appropriate view
  return (
    <SafeAreaView style={styles.container}>
      {currentView === 'main' && (
        <MainViewComponent
          handleCategorySelect={handleCategorySelect}
          goBackToDrawer={goBackToDrawer}
        />
      )}
      {currentView === 'subfilters' && <SubFiltersView />}
      {currentView === 'details' && <DetailsView />}
      <ImageModalComponent
        visible={imageModalVisible}
        selectedItem={selectedItem}
        onClose={closeModals}
      />
      <PdfModalComponent
        visible={pdfModalVisible}
        selectedItem={selectedItem}
        onClose={closeModals}
      />
    </SafeAreaView>
  );
};

export const OccasionsScreen = React.memo(OccasionsScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.lightGray,
  },

  // Header styles
  header: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: AppColors.white,
    opacity: 0.9,
  },

  // Stats styles
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: AppColors.gray,
    textAlign: 'center',
  },

  // Category styles
  categoriesContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  categoryCard: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    marginVertical: 8,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.dark,
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 13,
    color: AppColors.gray,
    lineHeight: 18,
    marginBottom: 8,
  },
  itemCountContainer: {
    backgroundColor: AppColors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  itemCountText: {
    fontSize: 11,
    color: AppColors.primary,
    fontWeight: '600',
  },
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 20,
  },

  // Sub-filter styles
  subFilterCard: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    marginVertical: 6,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subFilterContent: {
    flex: 1,
  },
  subFilterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 4,
  },
  subFilterDescription: {
    fontSize: 13,
    color: AppColors.gray,
    marginBottom: 6,
  },
  subFilterCount: {
    fontSize: 11,
    color: AppColors.primary,
    fontWeight: '500',
  },

  // Type Filter styles
  typeFilterContainer: {
    backgroundColor: AppColors.cream,
    paddingVertical: 8,
    maxHeight: 50,
  },
  filterContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  typeButton: {
    backgroundColor: AppColors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: AppColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 30,
  },
  typeButtonActive: {
    backgroundColor: AppColors.dark,
    borderColor: AppColors.dark,
  },
  typeIcon: {
    marginRight: 4,
  },
  typeButtonText: {
    fontSize: 12,
    color: AppColors.gray,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: AppColors.white,
  },

  // Item styles
  scrollView: {
    flex: 1,
  },
  itemsGrid: {
    paddingHorizontal: 10,
  },
  itemCard: {
    backgroundColor: AppColors.white,
    marginHorizontal: 5,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 8,
  },
  typeIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    height: 120,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: AppColors.lightGray,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    padding: 12,
    paddingTop: 0,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 4,
    lineHeight: 20,
  },
  authorName: {
    fontSize: 13,
    color: AppColors.primary,
    fontWeight: '500',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 13,
    color: AppColors.gray,
    lineHeight: 18,
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 12,
    color: AppColors.gray,
    fontWeight: '500',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 11,
    color: AppColors.white,
    fontWeight: '500',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.gray,
    textAlign: 'center',
  },

  // Footer
  footer: {
    padding: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: AppColors.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalHeader: {
    paddingTop: StatusBar.currentHeight || 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.white,
    marginRight: 20,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  imageModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fullScreenImage: {
    width: width - 40,
    height: height - 200,
    borderRadius: 8,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  modalFooterText: {
    color: AppColors.white,
    fontSize: 14,
    opacity: 0.8,
  },

  // PDF Modal Styles
  pdfModalContainer: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  pdfModalHeader: {
    backgroundColor: AppColors.teal,
    paddingTop: StatusBar.currentHeight || 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  pdfHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    marginRight: 20,
  },
  pdfModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.white,
  },
  viewerLabel: {
    fontSize: 12,
    color: AppColors.white,
    opacity: 0.9,
    marginTop: 2,
  },
  pdfCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  pdfContent: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.lightGray,
    padding: 20,
  },
  loadingSpinner: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: AppColors.white,
    borderRadius: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingEmoji: {
    fontSize: 32,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: AppColors.dark,
    marginTop: 10,
    fontWeight: '600',
  },
});
