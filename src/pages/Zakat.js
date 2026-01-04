import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getZakatPrices, getCurrencyPrices, getAvailableCurrencies } from '../apis/zakatService';
import { FaCalculator, FaListUl, FaUsers, FaHandHoldingUsd, FaMoneyBillWave, FaGem, FaCoins, FaChartLine, FaStore, FaHome, FaArrowLeft } from 'react-icons/fa';
import './Prayer.css'; // We'll reuse the Prayer.css styles
import './emotionbase.css'; // Import for MUHAMMADIBOLD font
import Footer from '../components/Footer'; 
const zakatTopics = {
  'calculation': {
    title: 'Zakat Calculation',
    titleAr: 'حِسَابُ الزَّكَاةِ',
    titleUrdu: 'زکات کا حساب',
    icon: <FaCalculator className="topic-icon" />,
    content: [
      {
        title: "Nisab Threshold",
        description: "The minimum amount of wealth that must be owned for one lunar year",
        reference: "Hadith: Sahih al-Bukhari 1404",
        arabic: "وَلَيْسَ فِيمَا دُونَ خَمْسِ أَوَاقٍ صَدَقَةٌ",
        translation: "There is no Zakat on less than five awqiya (of silver)",
        urdu: "پانچ اوقیہ (چاندی) سے کم میں زکات نہیں ہے",
        values: [
          {
            type: "Gold",
            amount: "87.48 grams",
            equivalent: "Approximately 2,680,000 PKR"
          },
          {
            type: "Silver",
            amount: "612.36 grams",
            equivalent: "Approximately 216,000 PKR"
          }
        ],
        rate: "2.5% of eligible wealth"
      },
      {
        title: "Basic Formula",
        reference: "Qur'an 2:267",
        arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا أَنفِقُوا مِن طَيِّبَاتِ مَا كَسَبْتُمْ",
        translation: "O you who believe! Spend of the good things which you have earned",
        urdu: "اے ایمان والو! جو پاک چیزیں تم نے کمائی ہیں ان میں سے خرچ کرو",
        steps: [
          "Total Wealth = Cash + Gold/Silver + Investments + Business Assets",
          "Deduct Essential Liabilities",
          "If remaining amount > Nisab",
          "Zakat = Remaining Amount × 2.5%"
        ]
      },
      {
        title: "Common Items for Calculation",
        reference: "Hadith: Sahih Muslim 979",
        arabic: "فِي الرِّقَةِ رُبْعُ الْعُشْرِ",
        translation: "In silver, there is one-fourth of one-tenth (2.5%)",
        urdu: "چاندی میں چوتھائی دسواں حصہ (2.5%) ہے",
        items: [
          "Cash in hand and bank accounts",
          "Stocks and investments",
          "Business inventory and profits",
          "Rental property income",
          "Agricultural produce",
          "Livestock"
        ]
      }
    ]
  },
  'types': {
    title: 'Types of Zakat',
    titleAr: 'أَنْوَاعُ الزَّكَاةِ',
    titleUrdu: 'زکات کی اقسام',
    icon: <FaListUl className="topic-icon" />,
    content: [
      {
        type: "Zakat al-Mal",
        description: "Wealth Zakat",
        reference: "Qur'an 9:103",
        arabic: "خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا",
        translation: "Take from their wealth a charity by which you purify them and cause them increase",
        urdu: "ان کے مال میں سے صدقہ لے کر انہیں پاک کر اور ان کا تزکیہ کر",
        applicable_on: [
          "Money/savings",
          "Gold and silver",
          "Trade goods",
          "Agricultural produce",
          "Livestock",
          "Natural resources"
        ],
        rate: "2.5% annually"
      },
      {
        type: "Zakat al-Fitr",
        description: "Charity given at the end of Ramadan",
        reference: "Hadith: Sahih al-Bukhari 1503",
        arabic: "فَرَضَ رَسُولُ اللَّهِ ﷺ زَكَاةَ الْفِطْرِ",
        translation: "The Messenger of Allah ﷺ made Zakat al-Fitr obligatory",
        urdu: "رسول اللہ ﷺ نے زکات الفطر کو فرض قرار دیا",
        details: [
          "Mandatory for every Muslim",
          "Equal to one meal or its monetary value",
          "Given before Eid prayer"
        ]
      },
      {
        type: "Zakat on Agriculture",
        description: "Crops and fruits",
        reference: "Qur'an 6:141",
        arabic: "وَآتُوا حَقَّهُ يَوْمَ حَصَادِهِ",
        translation: "And give its due [Zakat] on the day of its harvest",
        urdu: "اور اس کی کٹائی کے دن اس کا حق ادا کرو",
        rates: [
          "10% if naturally irrigated",
          "5% if artificially irrigated"
        ]
      },
      {
        type: "Zakat on Livestock",
        description: "Camels, cattle, sheep, goats",
        reference: "Hadith: Sahih al-Bukhari 1454",
        arabic: "فِي كُلِّ خَمْسٍ مِنَ الْإِبِلِ السَّائِمَةِ شَاةٌ",
        translation: "For every five grazing camels, there is one sheep (as Zakat)",
        urdu: "ہر پانچ چرنے والے اونٹوں میں ایک بکری (زکات کے طور پر)",
        note: "Different rates apply based on quantity and type"
      }
    ]
  },
  'eligibility': {
    title: 'Who Needs to Pay',
    titleAr: 'مَنْ يَجِبُ عَلَيْهِ الزَّكَاةُ',
    titleUrdu: 'کس پر زکات لازم ہے',
    icon: <FaUsers className="topic-icon" />,
    content: [
      {
        title: "Basic Conditions",
        reference: "Hadith: Sahih al-Bukhari 1395",
        arabic: "لَيْسَ عَلَى الْمُسْلِمِ فِي عَبْدِهِ وَلَا فَرَسِهِ صَدَقَةٌ",
        translation: "There is no Zakat on a Muslim's slave or horse",
        urdu: "مسلمان کے غلام اور گھوڑے میں کوئی زکات نہیں",
        conditions: [
          {
            condition: "Muslim",
            explanation: "Zakat is obligatory only on Muslims"
          },
          {
            condition: "Free Person",
            explanation: "Must have complete ownership of wealth"
          },
          {
            condition: "Sane and Adult",
            explanation: "Must be of sound mind and reached puberty"
          },
          {
            condition: "Hawl (Time)",
            explanation: "Wealth must be held for one lunar year"
          },
          {
            condition: "Nisab",
            explanation: "Wealth must exceed the minimum threshold"
          }
        ]
      },
      {
        title: "Exemptions",
        reference: "Hadith: Sunan Abu Dawud 1556",
        arabic: "لَيْسَ فِي دَارِ السُّكْنَى صَدَقَةٌ",
        translation: "There is no Zakat on a dwelling house",
        urdu: "رہائشی گھر میں کوئی زکات نہیں",
        list: [
          "Personal residence",
          "Vehicle for personal use",
          "Household furniture",
          "Tools of trade",
          "Basic living expenses"
        ]
      }
    ]
  },
  'distribution': {
    title: 'Distribution',
    titleAr: 'تَوْزِيعُ الزَّكَاةِ',
    titleUrdu: 'زکات کی تقسیم',
    icon: <FaHandHoldingUsd className="topic-icon" />,
    content: [
      {
        title: "Eight Categories of Recipients",
        reference: "Qur'an 9:60",
        arabic: "إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ",
        translation: "Zakat expenditures are only for the poor and for the needy and for those employed to collect [Zakat] and for bringing hearts together [for Islam] and for freeing captives [or slaves] and for those in debt and for the cause of Allah and for the [stranded] traveler",
        urdu: "زکات صرف فقراء، مساکین، زکات جمع کرنے والوں، دلوں کو موہ لینے والوں، غلاموں کو آزاد کرنے، مقروضوں، اللہ کی راہ میں اور مسافروں کے لیے ہے",
        categories: [
          {
            name: "Al-Fuqara (The Poor)",
            description: "Those who lack means of livelihood"
          },
          {
            name: "Al-Masakin (The Needy)",
            description: "Those who cannot meet basic needs"
          },
          {
            name: "Al-Amilin (Zakat Collectors)",
            description: "Those appointed to collect and distribute Zakat"
          },
          {
            name: "Al-Muallafat-ul-Qulub",
            description: "Those whose hearts are to be reconciled"
          },
          {
            name: "Ar-Riqab (Slaves)",
            description: "Freeing of slaves and captives"
          },
          {
            name: "Al-Gharimin (Debtors)",
            description: "Those in debt for lawful purposes"
          },
          {
            name: "Fi-Sabilillah",
            description: "In the cause of Allah"
          },
          {
            name: "Ibn-us-Sabil (Wayfarers)",
            description: "Travelers in need of assistance"
          }
        ]
      }
    ]
  },
  /* 'calculator' topic commented out - functionality merged into 'combined' calculator
  'calculator': {
    title: 'Zakat Calculator',
    titleAr: 'حَاسِبَةُ الزَّكَاةِ',
    titleUrdu: 'زکات کیلکولیٹر',
    icon: <FaCalculator className="topic-icon" />,
    content: {
      assets: [
        {
          id: 'money',
          name: 'Money',
          icon: <FaMoneyBillWave />,
          options: ['Cash in hands', 'Cash in bank accounts']
        },
        {
          id: 'gold',
          name: 'Gold',
          icon: <FaGem />,
          pricePerGram: null,
          options: []
        },
        {
          id: 'silver',
          name: 'Silver',
          icon: <FaCoins />,
          pricePerGram: null,
          options: []
        }
      ]
    }
  },
  */
  'combined': {
    title: 'Zakat Calculator',
    titleAr: 'حَاسِبَةُ الزَّكَاةِ',
    titleUrdu: 'زکات کیلکولیٹر',
    icon: <FaCalculator className="topic-icon" />,
    content: {
      description: 'Calculate Zakat on combined assets (gold + silver + money) to check total eligibility',
      assets: [
        { id: 'gold', name: 'Gold', icon: <FaGem />, units: ['Gram', 'Tola', 'Kg'] },
        { id: 'silver', name: 'Silver', icon: <FaCoins />, units: ['Gram', 'Tola', 'Kg'] },
        { id: 'money', name: 'Money', icon: <FaMoneyBillWave />, units: ['currency'] }
      ]
    }
  }
};

// Nisab thresholds
const NISAB_THRESHOLDS = {
  money: 179689, // PKR
  gold: {
    grams: 87.48,
    tolas: 7.5,
    kg: 0.08748
  },
  silver: {
    grams: 612.36,
    tolas: 52.5,
    kg: 0.61236
  }
};

const Zakat = () => {
  const navigate = useNavigate();

useEffect(() => {
    window.scrollTo(0, 0);
  }, []);



  const [zakatPrices, setZakatPrices] = useState(null);
  const [availableCurrencies, setAvailableCurrencies] = useState(['PKR', 'USD', 'EUR', 'GBP']); // Default currencies as fallback
  const [selectedCurrency, setSelectedCurrency] = useState('PKR');
  const [pricesLoading, setPricesLoading] = useState(true);
  
  const [activeTopic, setActiveTopic] = useState('calculation');
  const [calculations, setCalculations] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('PKR');
  const [totalAssets, setTotalAssets] = useState(0);
  const [zakatDisplayMode, setZakatDisplayMode] = useState('currency'); // 'currency' or 'weight'
  const [totalAssetsInWeight, setTotalAssetsInWeight] = useState({ gold: 0, silver: 0, units: { gold: 'Gram', silver: 'Gram' } });

  // Combined calculator state
  const [combinedAssets, setCombinedAssets] = useState({
    gold: { amount: '', unit: 'Gram' },
    silver: { amount: '', unit: 'Gram' },
    money: { amount: '', unit: 'PKR' }
  });
  const [combinedResult, setCombinedResult] = useState(null);

  // Fetch gold and silver prices on component mount
  React.useEffect(() => {
    const fetchPrices = async () => {
      try {
        setPricesLoading(true);
        const data = await getZakatPrices();
        console.log('Fetched zakat data:', data); // Debug log
        setZakatPrices(data);
        
        // Debug: Check PKR prices specifically
        if (data && data.currencies && data.currencies.PKR) {
          console.log('PKR Gold price per gram:', data.currencies.PKR.gold.perGram);
          console.log('PKR Gold price per tola:', data.currencies.PKR.gold.perTola);
        }
        
        // Get available currencies from the data - fix the parameter
        if (data && data.currencies) {
          const currencies = getAvailableCurrencies(data);
          console.log('Available currencies:', currencies); // Debug log
          console.log('Number of currencies:', currencies.length); // Debug log
          if (currencies.length > 0) {
            setAvailableCurrencies(currencies);
          }
        }
      } catch (err) {
        console.error('Failed to fetch zakat prices:', err);
        // Keep the default currencies if fetch fails
      } finally {
        setPricesLoading(false);
      }
    };
    fetchPrices();
  }, []);

  // Update currency when selectedAsset changes
  useEffect(() => {
    if (selectedAsset) {
      if (selectedAsset.id === 'money') {
        setCurrency(selectedCurrency); // Use selected currency for money
      } else if (selectedAsset.id === 'gold' || selectedAsset.id === 'silver') {
        setCurrency('Gram'); // Default weight unit for precious metals
      }
    }
  }, [selectedAsset, selectedCurrency]);

  // Convert existing calculations when currency changes
  useEffect(() => {
    if (zakatPrices && calculations.length > 0 && zakatPrices.currencies) {
      const currentCurrencyPrices = getCurrencyPrices(zakatPrices, selectedCurrency);
      const previousCurrency = calculations[0]?.currency; // Get currency from first calculation
      
      if (currentCurrencyPrices && previousCurrency && previousCurrency !== selectedCurrency) {
        const previousCurrencyPrices = getCurrencyPrices(zakatPrices, previousCurrency);
        
        if (previousCurrencyPrices && previousCurrencyPrices.usd && currentCurrencyPrices.usd) {
          // Convert existing calculations to new currency
          const convertedCalculations = calculations.map(calc => {
            // Convert from previous currency to USD first, then to new currency
            const usdAmount = calc.convertedAmount / previousCurrencyPrices.usd;
            const newCurrencyAmount = usdAmount * currentCurrencyPrices.usd;
            
            return {
              ...calc,
              convertedAmount: newCurrencyAmount,
              currency: selectedCurrency
            };
          });
          
          setCalculations(convertedCalculations);
          
          // Recalculate total assets
          const newTotal = convertedCalculations.reduce((sum, calc) => sum + calc.convertedAmount, 0);
          setTotalAssets(newTotal);
        }
      }
    }

    // Update combined assets money unit when currency changes
    setCombinedAssets(prev => ({
      ...prev,
      money: { ...prev.money, unit: selectedCurrency }
    }));
  }, [selectedCurrency, zakatPrices, calculations]);

  const calculateZakat = (total) => {
    return (total * 2.5) / 100;
  };

  const calculateZakatInWeight = (weightData) => {
    const goldZakat = (weightData.gold * 2.5) / 100;
    const silverZakat = (weightData.silver * 2.5) / 100;
    return { gold: goldZakat, silver: silverZakat };
  };

  const convertGramsToUnit = (grams, unit) => {
    if (unit === 'Tola') {
      return grams / 11.664;
    } else if (unit === 'Kg') {
      return grams / 1000;
    }
    return grams; // Default to grams
  };

  const formatTotalAssetsInWeight = () => {
    let display = [];
    
    if (totalAssetsInWeight.gold > 0) {
      const convertedGold = convertGramsToUnit(totalAssetsInWeight.gold, totalAssetsInWeight.units.gold);
      display.push(`${convertedGold.toFixed(3)} ${totalAssetsInWeight.units.gold} Gold`);
    }
    if (totalAssetsInWeight.silver > 0) {
      const convertedSilver = convertGramsToUnit(totalAssetsInWeight.silver, totalAssetsInWeight.units.silver);
      display.push(`${convertedSilver.toFixed(3)} ${totalAssetsInWeight.units.silver} Silver`);
    }
    
    return display.length > 0 ? display.join(' + ') : '0';
  };

  const formatZakatDisplay = () => {
    if (zakatDisplayMode === 'currency') {
      const currencyPrices = getCurrencyPrices(zakatPrices, selectedCurrency);
      const currencySymbol = currencyPrices?.symbol || selectedCurrency;
      return `${currencySymbol}${calculateZakat(totalAssets).toFixed(2)} ${selectedCurrency}`;
    } else {
      const weightZakat = calculateZakatInWeight(totalAssetsInWeight);
      let display = [];
      
      if (weightZakat.gold > 0) {
        const convertedGoldZakat = convertGramsToUnit(weightZakat.gold, totalAssetsInWeight.units.gold);
        display.push(`${convertedGoldZakat.toFixed(3)} ${totalAssetsInWeight.units.gold} Gold`);
      }
      if (weightZakat.silver > 0) {
        const convertedSilverZakat = convertGramsToUnit(weightZakat.silver, totalAssetsInWeight.units.silver);
        display.push(`${convertedSilverZakat.toFixed(3)} ${totalAssetsInWeight.units.silver} Silver`);
      }
      
      return display.length > 0 ? display.join(' + ') : '0';
    }
  };

  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
  };

  const calculateCombinedZakat = () => {
    if (!zakatPrices) {
      alert('Please wait for prices to load');
      return;
    }

    const currencyPrices = getCurrencyPrices(zakatPrices, selectedCurrency);
    if (!currencyPrices) {
      alert('Currency prices not available');
      return;
    }

    let totalValueInCurrency = 0;
    let assetBreakdown = [];

    // Calculate Gold value
    if (combinedAssets.gold.amount && parseFloat(combinedAssets.gold.amount) > 0) {
      let goldAmountInGrams = parseFloat(combinedAssets.gold.amount);
      
      if (combinedAssets.gold.unit === 'Tola') {
        goldAmountInGrams = parseFloat(combinedAssets.gold.amount) * 11.664;
      } else if (combinedAssets.gold.unit === 'Kg') {
        goldAmountInGrams = parseFloat(combinedAssets.gold.amount) * 1000;
      }
      
      const goldValue = goldAmountInGrams * currencyPrices.gold.perGram;
      totalValueInCurrency += goldValue;
      assetBreakdown.push({
        type: 'Gold',
        amount: `${combinedAssets.gold.amount} ${combinedAssets.gold.unit}`,
        value: goldValue,
        weightInGrams: goldAmountInGrams
      });
    }

    // Calculate Silver value
    if (combinedAssets.silver.amount && parseFloat(combinedAssets.silver.amount) > 0) {
      let silverAmountInGrams = parseFloat(combinedAssets.silver.amount);
      
      if (combinedAssets.silver.unit === 'Tola') {
        silverAmountInGrams = parseFloat(combinedAssets.silver.amount) * 11.664;
      } else if (combinedAssets.silver.unit === 'Kg') {
        silverAmountInGrams = parseFloat(combinedAssets.silver.amount) * 1000;
      }
      
      const silverValue = silverAmountInGrams * currencyPrices.silver.perGram;
      totalValueInCurrency += silverValue;
      assetBreakdown.push({
        type: 'Silver',
        amount: `${combinedAssets.silver.amount} ${combinedAssets.silver.unit}`,
        value: silverValue,
        weightInGrams: silverAmountInGrams
      });
    }

    // Add Money value
    if (combinedAssets.money.amount && parseFloat(combinedAssets.money.amount) > 0) {
      const moneyValue = parseFloat(combinedAssets.money.amount);
      totalValueInCurrency += moneyValue;
      assetBreakdown.push({
        type: 'Money',
        amount: `${combinedAssets.money.amount} ${selectedCurrency}`,
        value: moneyValue
      });
    }

    // Check eligibility using both gold and silver Nisab thresholds
    const goldNisabThreshold = NISAB_THRESHOLDS.gold.grams * currencyPrices.gold.perGram;
    const silverNisabThreshold = NISAB_THRESHOLDS.silver.grams * currencyPrices.silver.perGram;
    
    const isEligibleByGold = totalValueInCurrency >= goldNisabThreshold;
    const isEligibleBySilver = totalValueInCurrency >= silverNisabThreshold;
    const isEligible = isEligibleByGold || isEligibleBySilver; // Eligible if either threshold is met
    
    const zakatAmount = isEligible ? (totalValueInCurrency * 2.5) / 100 : 0;
    const currencySymbol = currencyPrices?.symbol || selectedCurrency;

    setCombinedResult({
      totalValue: totalValueInCurrency,
      isEligible,
      isEligibleByGold,
      isEligibleBySilver,
      zakatAmount,
      goldNisabThreshold,
      silverNisabThreshold,
      assetBreakdown,
      currency: selectedCurrency,
      currencySymbol
    });
  };

  const calculateDetailedEligibility = () => {
    if (!zakatPrices || totalAssets === 0) return null;

    const currencyPrices = getCurrencyPrices(zakatPrices, selectedCurrency);
    if (!currencyPrices) return null;

    const goldNisabThreshold = NISAB_THRESHOLDS.gold.grams * currencyPrices.gold.perGram;
    const silverNisabThreshold = NISAB_THRESHOLDS.silver.grams * currencyPrices.silver.perGram;
    
    const isEligibleByGold = totalAssets >= goldNisabThreshold;
    const isEligibleBySilver = totalAssets >= silverNisabThreshold;
    const isEligible = isEligibleByGold || isEligibleBySilver;
    
    const zakatAmount = isEligible ? (totalAssets * 2.5) / 100 : 0;
    const currencySymbol = currencyPrices?.symbol || selectedCurrency;

    return {
      totalAssets,
      isEligible,
      isEligibleByGold,
      isEligibleBySilver,
      zakatAmount,
      goldNisabThreshold,
      silverNisabThreshold,
      currencySymbol,
      currency: selectedCurrency
    };
  };

  const resetCombinedCalculator = () => {
    setCombinedAssets({
      gold: { amount: '', unit: 'Gram' },
      silver: { amount: '', unit: 'Gram' },
      money: { amount: '', unit: selectedCurrency }
    });
    setCombinedResult(null);
  };

  const handleAmountSubmit = (e) => {
    e.preventDefault();
    if (amount && selectedAsset) {
      let convertedAmount = parseFloat(amount);
      let displayCurrency = selectedCurrency; // Use selected currency as the base
      let isEligible = true;
      let eligibilityMessage = '';
      
      // Check eligibility based on Nisab thresholds
      if (selectedAsset.id === 'money' && zakatPrices) {
        // Calculate both Nisab thresholds for selected currency
        const currencyPrices = getCurrencyPrices(zakatPrices, selectedCurrency);
        if (currencyPrices) {
          const goldNisabThreshold = NISAB_THRESHOLDS.gold.grams * currencyPrices.gold.perGram;
          const silverNisabThreshold = NISAB_THRESHOLDS.silver.grams * currencyPrices.silver.perGram;
          const moneyAmount = parseFloat(amount);
          
          if (moneyAmount < silverNisabThreshold && moneyAmount < goldNisabThreshold) {
            isEligible = false;
            const currencySymbol = zakatPrices.currencies[selectedCurrency]?.symbol || selectedCurrency;
            eligibilityMessage = `Money amount must be at least ${currencySymbol}${silverNisabThreshold.toFixed(2)} (Silver Nisab) or ${currencySymbol}${goldNisabThreshold.toFixed(2)} (Gold Nisab) to be eligible for Zakat`;
          }
        }
        // For money, the amount is already in the selected currency
        convertedAmount = parseFloat(amount);
      } else if (selectedAsset.id === 'gold') {
        if (currency === 'Gram' && parseFloat(amount) < NISAB_THRESHOLDS.gold.grams) {
          isEligible = false;
          eligibilityMessage = `Gold amount must be ${NISAB_THRESHOLDS.gold.grams} grams or more to be eligible for Zakat`;
        } else if (currency === 'Tola' && parseFloat(amount) < NISAB_THRESHOLDS.gold.tolas) {
          isEligible = false;
          eligibilityMessage = `Gold amount must be ${NISAB_THRESHOLDS.gold.tolas} tolas or more to be eligible for Zakat`;
        } else if (currency === 'Kg' && parseFloat(amount) < NISAB_THRESHOLDS.gold.kg) {
          isEligible = false;
          eligibilityMessage = `Gold amount must be ${NISAB_THRESHOLDS.gold.kg} kg or more to be eligible for Zakat`;
        }
      } else if (selectedAsset.id === 'silver') {
        if (currency === 'Gram' && parseFloat(amount) < NISAB_THRESHOLDS.silver.grams) {
          isEligible = false;
          eligibilityMessage = `Silver amount must be ${NISAB_THRESHOLDS.silver.grams} grams or more to be eligible for Zakat`;
        } else if (currency === 'Tola' && parseFloat(amount) < NISAB_THRESHOLDS.silver.tolas) {
          isEligible = false;
          eligibilityMessage = `Silver amount must be ${NISAB_THRESHOLDS.silver.tolas} tolas or more to be eligible for Zakat`;
        } else if (currency === 'Kg' && parseFloat(amount) < NISAB_THRESHOLDS.silver.kg) {
          isEligible = false;
          eligibilityMessage = `Silver amount must be ${NISAB_THRESHOLDS.silver.kg} kg or more to be eligible for Zakat`;
        }
      }

      if (!isEligible) {
        alert(eligibilityMessage);
        return;
      }
      
      // Convert gold/silver to selected currency
      if (selectedAsset.id === 'gold' && zakatPrices) {
        // Get prices for selected currency
        const currencyPrices = getCurrencyPrices(zakatPrices, selectedCurrency);
        console.log('Gold calculation debug:');
        console.log('Selected currency:', selectedCurrency);
        console.log('Full zakatPrices object:', zakatPrices);
        console.log('Currency prices object:', currencyPrices);
        console.log('Amount entered:', amount, currency);
        
        if (currencyPrices) {
          if (currency === 'Gram') {
            convertedAmount = parseFloat(amount) * currencyPrices.gold.perGram;
            console.log('Gold per gram price:', currencyPrices.gold.perGram);
            console.log('Converted amount:', convertedAmount);
          } else if (currency === 'Tola') {
            convertedAmount = parseFloat(amount) * currencyPrices.gold.perTola;
          } else if (currency === 'Kg') {
            convertedAmount = parseFloat(amount) * currencyPrices.gold.perGram * 1000; // Convert Kg to grams then multiply by per gram price
          }
        }
      } else if (selectedAsset.id === 'silver' && zakatPrices) {
        // Get prices for selected currency
        const currencyPrices = getCurrencyPrices(zakatPrices, selectedCurrency);
        if (currencyPrices) {
          if (currency === 'Gram') {
            convertedAmount = parseFloat(amount) * currencyPrices.silver.perGram;
          } else if (currency === 'Tola') {
            convertedAmount = parseFloat(amount) * currencyPrices.silver.perTola;
          } else if (currency === 'Kg') {
            convertedAmount = parseFloat(amount) * currencyPrices.silver.perGram * 1000; // Convert Kg to grams then multiply by per gram price
          }
        }
      }

      const newCalculation = {
        id: Date.now(),
        asset: selectedAsset.name,
        option: selectedAsset.selectedOption,
        amount: parseFloat(amount),
        originalCurrency: currency,
        convertedAmount,
        currency: displayCurrency,
        date: new Date().toISOString()
      };

      setCalculations([...calculations, newCalculation]);
      const newTotal = totalAssets + convertedAmount;
      setTotalAssets(newTotal);
      
      // Update weight tracking for gold/silver
      if (selectedAsset.id === 'gold' || selectedAsset.id === 'silver') {
        const newWeightData = { ...totalAssetsInWeight };
        
        // Convert amount to grams if needed
        let amountInGrams = parseFloat(amount);
        if (currency === 'Tola') {
          amountInGrams = parseFloat(amount) * 11.664; // 1 tola = 11.664 grams
        } else if (currency === 'Kg') {
          amountInGrams = parseFloat(amount) * 1000; // 1 kg = 1000 grams
        }
        
        newWeightData[selectedAsset.id] += amountInGrams;
        // Update the unit to the most recently used one for this metal type
        newWeightData.units[selectedAsset.id] = currency;
        setTotalAssetsInWeight(newWeightData);
      }
      
      setAmount('');
      setSelectedAsset(null);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white mt-10">
      <Navbar />
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-2 md:px-8 gap-8 flex-1 mt-10">
        {/* Back Button */}
        <div className="md:w-auto flex items-start pt-6">
          <button
            onClick={() => navigate('/learning-path')}
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
              Zakat Topics
            </h3>
            <ul className="space-y-2">
              {Object.keys(zakatTopics).map(topicKey => (
                <li key={topicKey}>
                  <button
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors duration-200 font-semibold border-2 shadow-sm h-[77px]
                      ${activeTopic === topicKey
                        ? 'bg-gradient-to-br from-[#e0c33e]/80 to-[#055160]/80 text-[#033642] border-[#e0c33e] shadow-lg'
                        : 'bg-white border-[#055160]/10 text-[#055160] hover:bg-[#e0c33e]/10 hover:text-[#055160]'}
                    `}
                    onClick={() => setActiveTopic(topicKey)}
                  >
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2">
                        {zakatTopics[topicKey].icon}
                        <span className="font-semibold">{zakatTopics[topicKey].title}</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      {topicKey === 'types' ? (
                        <span className="font-semibold text-right font-urdu">
                          زکات کی<br/>اقسام
                        </span>
                      ) : (
                        <span className="font-semibold text-right font-urdu">{zakatTopics[topicKey].titleUrdu}</span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:w-2/3 lg:w-3/4 py-6">
          <div className="bg-[[gradient-to-br from-[#033642]/10 to-[#e0c33e]]]/10 rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-extrabold text-[#055160]">{zakatTopics[activeTopic].title}</h2>
                <h3 className="text-xl font-bold text-[#055160] mt-2 font-urdu">{zakatTopics[activeTopic].titleUrdu}</h3>
              </div>
              <div className="text-right" dir="rtl">
                <h2 className="text-3xl font-extrabold text-[#055160]" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{zakatTopics[activeTopic].titleAr}</h2>
              </div>
            </div>
            <div className="topic-details">
              {/* Old calculator section - functionality merged into 'combined' calculator */}
              {false && activeTopic === 'calculator' && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <button
                        onClick={() => {
                          setCalculations([]);
                          setTotalAssets(0);
                          setTotalAssetsInWeight({ gold: 0, silver: 0, units: { gold: 'Gram', silver: 'Gram' } });
                          setZakatDisplayMode('currency');
                        }}
                        className="flex items-center gap-2 bg-[#055160] text-white px-4 py-2 rounded-lg hover:bg-[#033642] transition-colors"
                      >
                        <span>+</span> New Calculation
                      </button>
                      
                      {calculations.length > 0 && (
                        <button
                          onClick={() => {
                            setCalculations([]);
                            setTotalAssets(0);
                            setTotalAssetsInWeight({ gold: 0, silver: 0, units: { gold: 'Gram', silver: 'Gram' } });
                            setZakatDisplayMode('currency');
                          }}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <span>🗑️</span> Clear All
                        </button>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <label className="text-[#055160] font-semibold">Currency:</label>
                        <select
                          value={selectedCurrency}
                          onChange={(e) => setSelectedCurrency(e.target.value)}
                          className="p-2 border rounded text-lg bg-white border-[#055160] min-w-[100px]"
                          disabled={pricesLoading}
                        >
                          {pricesLoading ? (
                            <option value="">Loading...</option>
                          ) : (
                            availableCurrencies.map(currencyCode => (
                              <option key={currencyCode} value={currencyCode}>
                                {currencyCode}
                              </option>
                            ))
                          )}
                        </select>
                        {pricesLoading && (
                          <span className="text-sm text-gray-500">Fetching rates...</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {calculations.map((calc) => (
                        <div key={calc.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
                          <div>
                            <h3 className="font-semibold text-xl">{calc.asset} {calc.option ? `- ${calc.option}` : ''}</h3>
                            <p className="text-lg text-gray-600">
                              {calc.originalCurrency && calc.originalCurrency !== calc.currency ? 
                                `${calc.amount} ${calc.originalCurrency} = ${calc.convertedAmount.toFixed(2)} ${calc.currency}` :
                                `${calc.amount} ${calc.currency}`
                              }
                            </p>
                          </div>
                          <div className="text-lg text-gray-500">
                            Due: {new Date(calc.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/80 rounded-xl shadow-lg p-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {zakatTopics[activeTopic].content.assets.map((asset) => (
                        <button
                          key={asset.id}
                          onClick={() => handleAssetSelect(asset)}
                          className={`p-4 rounded-lg flex flex-col items-center gap-2 ${selectedAsset?.id === asset.id ? 'bg-[#e0c33e]/20' : 'bg-gray-50'
                            }`}
                        >
                          <span className="text-2xl text-[#055160]">{asset.icon}</span>
                          <span className="text-sm">{asset.name}</span>
                        </button>
                      ))}
                    </div>

                    {activeTopic === 'calculator' && selectedAsset && (
                      <form onSubmit={handleAmountSubmit} className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="Amount"
                              className="flex-1 p-2 border rounded text-lg"
                            />
                            {selectedAsset.id === 'money' ? (
                              <select
                                value={selectedCurrency}
                                onChange={(e) => {
                                  setSelectedCurrency(e.target.value);
                                  setCurrency(e.target.value);
                                }}
                                className="p-2 border rounded text-lg bg-white border-gray-300 min-w-[100px]"
                                disabled={pricesLoading}
                              >
                                {pricesLoading ? (
                                  <option value="">Loading...</option>
                                ) : (
                                  availableCurrencies.map(currencyCode => (
                                    <option key={currencyCode} value={currencyCode}>
                                      {currencyCode}
                                    </option>
                                  ))
                                )}
                              </select>
                            ) : (
                              <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="p-2 border rounded text-lg bg-white border-gray-300"
                              >
                                <option value="Tola">Tola</option>
                                <option value="Gram">Gram</option>
                                <option value="Kg">Kg</option>
                              </select>
                            )}
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-[#055160] text-white py-2 rounded-lg hover:bg-[#033642] transition-colors"
                        >
                          Add to Calculation
                        </button>
                      </form>
                    )}

                    <div className="mt-6 space-y-2">
                      <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">Total Assets:</span>
                          <span className="text-lg">
                            {zakatDisplayMode === 'currency' ? (
                              `${zakatPrices?.currencies?.[selectedCurrency]?.symbol || selectedCurrency}${totalAssets.toFixed(2)} ${selectedCurrency}`
                            ) : (
                              formatTotalAssetsInWeight()
                            )}
                          </span>
                        </div>
                        {(totalAssetsInWeight.gold > 0 || totalAssetsInWeight.silver > 0) && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => setZakatDisplayMode(zakatDisplayMode === 'currency' ? 'weight' : 'currency')}
                              className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors duration-200 flex items-center gap-1"
                            >
                              <span>
                                {zakatDisplayMode === 'currency' ? '⚖️' : '💰'}
                              </span>
                              {zakatDisplayMode === 'currency' ? 'Show in Weight' : 'Show in Currency'}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Detailed Eligibility Status for Individual Calculator */}
                      {totalAssets > 0 && (() => {
                        const eligibilityInfo = calculateDetailedEligibility();
                        return eligibilityInfo ? (
                          <div className="space-y-3">
                            {/* Gold Nisab Comparison */}
                            <div className={`p-3 rounded-lg text-sm ${eligibilityInfo.isEligibleByGold ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{eligibilityInfo.isEligibleByGold ? '✅' : '❌'}</span>
                                <span className="font-bold">
                                  {eligibilityInfo.isEligibleByGold ? 'Eligible by Gold Nisab' : 'Not Eligible by Gold Nisab'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                Gold Nisab: {eligibilityInfo.currencySymbol}{eligibilityInfo.goldNisabThreshold.toFixed(2)} {eligibilityInfo.currency}
                                {eligibilityInfo.isEligibleByGold ? ' (✓ Above threshold)' : ' (✗ Below threshold)'}
                              </p>
                            </div>

                            {/* Silver Nisab Comparison */}
                            <div className={`p-3 rounded-lg text-sm ${eligibilityInfo.isEligibleBySilver ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{eligibilityInfo.isEligibleBySilver ? '✅' : '❌'}</span>
                                <span className="font-bold">
                                  {eligibilityInfo.isEligibleBySilver ? 'Eligible by Silver Nisab' : 'Not Eligible by Silver Nisab'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                Silver Nisab: {eligibilityInfo.currencySymbol}{eligibilityInfo.silverNisabThreshold.toFixed(2)} {eligibilityInfo.currency}
                                {eligibilityInfo.isEligibleBySilver ? ' (✓ Above threshold)' : ' (✗ Below threshold)'}
                              </p>
                            </div>

                            {/* Overall Status */}
                            <div className={`p-3 rounded-lg border-2 text-sm ${eligibilityInfo.isEligible ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">{eligibilityInfo.isEligible ? '🎉' : '💔'}</span>
                                <span className="font-bold">
                                  {eligibilityInfo.isEligible ? 'ZAKAT IS OBLIGATORY' : 'ZAKAT IS NOT REQUIRED'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}

                      <div className="flex flex-col p-4 bg-[#e0c33e]/10 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">Zakat Due:</span>
                          <span className="text-lg text-[#055160]">
                            {formatZakatDisplay()}
                          </span>
                        </div>
                        {(totalAssetsInWeight.gold > 0 || totalAssetsInWeight.silver > 0) && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => setZakatDisplayMode(zakatDisplayMode === 'currency' ? 'weight' : 'currency')}
                              className="px-3 py-1 bg-[#055160] text-white rounded-lg text-sm hover:bg-[#033642] transition-colors duration-200 flex items-center gap-1"
                            >
                              <span>
                                {zakatDisplayMode === 'currency' ? '⚖️' : '💰'}
                              </span>
                              {zakatDisplayMode === 'currency' ? 'Show in Weight' : 'Show in Currency'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTopic === 'combined' && (
                <div className="space-y-6">
                  <div className="bg-white/80 rounded-xl shadow-lg p-6">
                    <div className="mb-6">
                      <h4 className="text-xl font-bold text-[#055160] mb-2">Combined Assets Zakat Calculator</h4>
                      <p className="text-gray-600 mb-4">
                        Enter your total assets (gold, silver, and money) to check if you're eligible for Zakat based on combined wealth.
                        This allows you to enter amounts even below individual Nisab thresholds.
                      </p>
                      
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <label className="text-[#055160] font-semibold">Currency:</label>
                          <select
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                            className="p-2 border rounded text-lg bg-white border-[#055160] min-w-[100px]"
                            disabled={pricesLoading}
                          >
                            {pricesLoading ? (
                              <option value="">Loading...</option>
                            ) : (
                              availableCurrencies.map(currencyCode => (
                                <option key={currencyCode} value={currencyCode}>
                                  {currencyCode}
                                </option>
                              ))
                            )}
                          </select>
                        </div>
                        <button
                          onClick={resetCombinedCalculator}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Reset All
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Gold Input */}
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-3">
                          <FaGem className="text-yellow-600 text-xl" />
                          <h5 className="font-semibold text-[#055160]">Gold</h5>
                        </div>
                        <div className="space-y-2">
                          <input
                            type="number"
                            value={combinedAssets.gold.amount}
                            onChange={(e) => setCombinedAssets(prev => ({
                              ...prev,
                              gold: { ...prev.gold, amount: e.target.value }
                            }))}
                            placeholder="Amount"
                            className="w-full p-2 border rounded text-lg"
                            step="0.001"
                            min="0"
                          />
                          <select
                            value={combinedAssets.gold.unit}
                            onChange={(e) => setCombinedAssets(prev => ({
                              ...prev,
                              gold: { ...prev.gold, unit: e.target.value }
                            }))}
                            className="w-full p-2 border rounded text-lg bg-white"
                          >
                            <option value="Gram">Gram</option>
                            <option value="Tola">Tola</option>
                            <option value="Kg">Kg</option>
                          </select>
                        </div>
                      </div>

                      {/* Silver Input */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <FaCoins className="text-gray-600 text-xl" />
                          <h5 className="font-semibold text-[#055160]">Silver</h5>
                        </div>
                        <div className="space-y-2">
                          <input
                            type="number"
                            value={combinedAssets.silver.amount}
                            onChange={(e) => setCombinedAssets(prev => ({
                              ...prev,
                              silver: { ...prev.silver, amount: e.target.value }
                            }))}
                            placeholder="Amount"
                            className="w-full p-2 border rounded text-lg"
                            step="0.001"
                            min="0"
                          />
                          <select
                            value={combinedAssets.silver.unit}
                            onChange={(e) => setCombinedAssets(prev => ({
                              ...prev,
                              silver: { ...prev.silver, unit: e.target.value }
                            }))}
                            className="w-full p-2 border rounded text-lg bg-white"
                          >
                            <option value="Gram">Gram</option>
                            <option value="Tola">Tola</option>
                            <option value="Kg">Kg</option>
                          </select>
                        </div>
                      </div>

                      {/* Money Input */}
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-3">
                          <FaMoneyBillWave className="text-green-600 text-xl" />
                          <h5 className="font-semibold text-[#055160]">Money</h5>
                        </div>
                        <div className="space-y-2">
                          <input
                            type="number"
                            value={combinedAssets.money.amount}
                            onChange={(e) => setCombinedAssets(prev => ({
                              ...prev,
                              money: { ...prev.money, amount: e.target.value }
                            }))}
                            placeholder="Amount"
                            className="w-full p-2 border rounded text-lg"
                            step="0.01"
                            min="0"
                          />
                          <div className="p-2 border rounded text-lg bg-gray-100 text-gray-600">
                            {selectedCurrency}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={calculateCombinedZakat}
                      className="w-full bg-[#055160] text-white py-3 rounded-lg hover:bg-[#033642] transition-colors font-semibold text-lg"
                      disabled={pricesLoading}
                    >
                      {pricesLoading ? 'Loading prices...' : 'Calculate Combined Zakat'}
                    </button>

                    {/* Results Display */}
                    {combinedResult && (
                      <div className="mt-6 space-y-4">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                          <h4 className="text-xl font-bold text-[#055160] mb-4">Zakat Calculation Results</h4>
                          
                          {/* Asset Breakdown */}
                          <div className="mb-4">
                            <h5 className="font-semibold text-[#055160] mb-2">Asset Breakdown:</h5>
                            <div className="space-y-2">
                              {combinedResult.assetBreakdown.map((asset, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                  <span>{asset.type}: {asset.amount}</span>
                                  <span className="font-semibold">
                                    {combinedResult.currencySymbol}{asset.value.toFixed(2)} {combinedResult.currency}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Total Value */}
                          <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg mb-4">
                            <span className="font-semibold text-lg">Total Asset Value:</span>
                            <span className="font-bold text-lg text-[#055160]">
                              {combinedResult.currencySymbol}{combinedResult.totalValue.toFixed(2)} {combinedResult.currency}
                            </span>
                          </div>

                          {/* Eligibility Status - Updated to show both Gold and Silver Nisab */}
                          <div className="space-y-3 mb-4">
                            {/* Gold Nisab Comparison */}
                            <div className={`p-4 rounded-lg ${combinedResult.isEligibleByGold ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{combinedResult.isEligibleByGold ? '✅' : '❌'}</span>
                                <span className="font-bold text-lg">
                                  {combinedResult.isEligibleByGold ? 'Eligible by Gold Nisab' : 'Not Eligible by Gold Nisab'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Gold Nisab: {combinedResult.currencySymbol}{combinedResult.goldNisabThreshold.toFixed(2)} {combinedResult.currency}
                                {combinedResult.isEligibleByGold ? ' (✓ Above threshold)' : ' (✗ Below threshold)'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Based on 87.48 grams of gold (7.5 tolas)
                              </p>
                            </div>

                            {/* Silver Nisab Comparison */}
                            <div className={`p-4 rounded-lg ${combinedResult.isEligibleBySilver ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{combinedResult.isEligibleBySilver ? '✅' : '❌'}</span>
                                <span className="font-bold text-lg">
                                  {combinedResult.isEligibleBySilver ? 'Eligible by Silver Nisab' : 'Not Eligible by Silver Nisab'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Silver Nisab: {combinedResult.currencySymbol}{combinedResult.silverNisabThreshold.toFixed(2)} {combinedResult.currency}
                                {combinedResult.isEligibleBySilver ? ' (✓ Above threshold)' : ' (✗ Below threshold)'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Based on 612.36 grams of silver (52.5 tolas)
                              </p>
                            </div>

                            {/* Overall Status */}
                            <div className={`p-4 rounded-lg border-2 ${combinedResult.isEligible ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-3xl">{combinedResult.isEligible ? '🎉' : '💔'}</span>
                                <span className="font-bold text-xl">
                                  {combinedResult.isEligible ? 'ZAKAT IS OBLIGATORY' : 'ZAKAT IS NOT REQUIRED'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                {combinedResult.isEligible 
                                  ? 'You meet the Nisab requirement and must pay Zakat (2.5% of total assets)'
                                  : 'Your total assets are below both Nisab thresholds. Zakat is not required at this time.'
                                }
                              </p>
                            </div>
                          </div>

                          {/* Zakat Amount */}
                          {combinedResult.isEligible && (
                            <div className="p-4 bg-[#e0c33e]/10 rounded-lg border-2 border-[#e0c33e]">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg">Zakat Due (2.5%):</span>
                                <span className="font-bold text-xl text-[#055160]">
                                  {combinedResult.currencySymbol}{combinedResult.zakatAmount.toFixed(2)} {combinedResult.currency}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTopic === 'calculation' && (
                <div className="space-y-6">
                  {zakatTopics[activeTopic].content.map((item, idx) => (
                    <div key={idx} className="bg-[#e0c33e]/10 rounded-xl p-6">
                      <h3 className="text-3xl font-bold text-[#055160] mb-4">{item.title}</h3>
                      {item.reference && (
                        <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-[#e0c33e]">
                          <p className="text-lg text-[#055160] font-semibold mb-2">{item.reference}</p>
                          {item.arabic && (
                            <p className="text-xl text-[#033642] mb-2 font-arabic" dir="rtl" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{item.arabic}</p>
                          )}
                          {item.translation && (
                            <p className="text-lg text-gray-600 italic mb-2">"{item.translation}"</p>
                          )}
                          {item.urdu && (
                            <p className="text-lg text-[#055160] font-urdu" dir="rtl">"{item.urdu}"</p>
                          )}
                        </div>
                      )}
                      {item.values && (
                        <div className="space-y-4 mb-4">
                          {/* First show the hardcoded Nisab threshold values */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {item.values.map((value, i) => (
                              <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                                <h4 className="font-semibold text-[#055160] text-xl">{value.type}</h4>
                                <p className="text-lg text-gray-600">{value.amount}</p>
                                <p className="text-lg text-gray-500">{value.equivalent}</p>
                              </div>
                            ))}
                          </div>
                          
                          {/* Then show the real-time prices if available */}
                          {item.title === 'Nisab Threshold' && zakatPrices && (
                            (() => {
                              const currencyPrices = getCurrencyPrices(zakatPrices, selectedCurrency);
                              const currencySymbol = zakatPrices.currencies[selectedCurrency]?.symbol || selectedCurrency;
                              return currencyPrices ? (
                                <div className="mt-6">
                                  <h5 className="text-lg font-semibold text-[#055160] mb-3">Current Market Prices ({selectedCurrency})</h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#e0c33e]">
                                      <h4 className="font-semibold text-[#055160] text-xl">Gold</h4>
                                      <p className="text-lg text-gray-600">{currencySymbol}{currencyPrices.gold.perGram} per gram</p>
                                      <p className="text-lg text-gray-500">Per Tola: {currencySymbol}{currencyPrices.gold.perTola}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#e0c33e]">
                                      <h4 className="font-semibold text-[#055160] text-xl">Silver</h4>
                                      <p className="text-lg text-gray-600">{currencySymbol}{currencyPrices.silver.perGram} per gram</p>
                                      <p className="text-lg text-gray-500">Per Tola: {currencySymbol}{currencyPrices.silver.perTola}</p>
                                    </div>
                                  </div>
                                </div>
                              ) : null;
                            })()
                          )}
                        </div>
                      )}
                      {item.steps && (
                        <ol className="list-decimal pl-5 space-y-2">
                          {item.steps.map((step, i) => (
                            <li key={i} className="text-gray-700 text-xl">{step}</li>
                          ))}
                        </ol>
                      )}
                      {item.items && (
                        <ul className="list-disc pl-5 space-y-2">
                          {item.items.map((listItem, i) => (
                            <li key={i} className="text-gray-700 text-xl">{listItem}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTopic === 'types' && (
                <div className="space-y-6">
                  {zakatTopics[activeTopic].content.map((type, idx) => (
                    <div key={idx} className="bg-[#e0c33e]/10 rounded-xl p-6">
                      <h3 className="text-3xl font-bold text-[#055160] mb-2">{type.type}</h3>
                      <p className="text-gray-600 mb-4 text-xl">{type.description}</p>
                      {type.reference && (
                        <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-[#e0c33e]">
                          <p className="text-lg text-[#055160] font-semibold mb-2">{type.reference}</p>
                          {type.arabic && (
                            <p className="text-xl text-[#033642] mb-2 font-arabic" dir="rtl" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{type.arabic}</p>
                          )}
                          {type.translation && (
                            <p className="text-lg text-gray-600 italic mb-2">"{type.translation}"</p>
                          )}
                          {type.urdu && (
                            <p className="text-lg text-[#055160] font-urdu" dir="rtl">"{type.urdu}"</p>
                          )}
                        </div>
                      )}
                      {type.applicable_on && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-[#055160] mb-2 text-xl">Applicable On:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {type.applicable_on.map((item, i) => (
                              <li key={i} className="text-gray-600 text-xl">{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {type.details && (
                        <ul className="list-disc pl-5 mt-4 space-y-1">
                          {type.details.map((detail, i) => (
                            <li key={i} className="text-gray-600 text-xl">{detail}</li>
                          ))}
                        </ul>
                      )}
                      {type.rates && (
                        <ul className="list-disc pl-5 mt-4 space-y-1">
                          {type.rates.map((rate, i) => (
                            <li key={i} className="text-gray-600 text-xl">{rate}</li>
                          ))}
                        </ul>
                      )}
                      {type.rate && (
                        <p className="text-[#055160] font-semibold mt-2 text-xl">Rate: {type.rate}</p>
                      )}
                      {type.note && (
                        <p className="text-gray-600 mt-2 italic text-xl">{type.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTopic === 'eligibility' && (
                <div className="space-y-6">
                  {zakatTopics[activeTopic].content.map((section, idx) => (
                    <div key={idx} className="bg-[#e0c33e]/10 rounded-xl p-6">
                      <h3 className="text-3xl font-bold text-[#055160] mb-4">{section.title}</h3>
                      {section.reference && (
                        <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-[#e0c33e]">
                          <p className="text-lg text-[#055160] font-semibold mb-2">{section.reference}</p>
                          {section.arabic && (
                            <p className="text-xl text-[#033642] mb-2 font-arabic" dir="rtl" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{section.arabic}</p>
                          )}
                          {section.translation && (
                            <p className="text-lg text-gray-600 italic mb-2">"{section.translation}"</p>
                          )}
                          {section.urdu && (
                            <p className="text-lg text-[#055160] font-urdu" dir="rtl">"{section.urdu}"</p>
                          )}
                        </div>
                      )}
                      {section.conditions && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {section.conditions.map((condition, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                              <h4 className="font-semibold text-[#055160] text-xl">{condition.condition}</h4>
                              <p className="text-lg text-gray-600">{condition.explanation}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {section.list && (
                        <ul className="list-disc pl-5 space-y-2">
                          {section.list.map((item, i) => (
                            <li key={i} className="text-gray-600 text-xl">{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTopic === 'distribution' && (
                <div className="space-y-6">
                  {zakatTopics[activeTopic].content.map((section, idx) => (
                    <div key={idx} className="bg-[#e0c33e]/10 rounded-xl p-6">
                      <h3 className="text-3xl font-bold text-[#055160] mb-4">{section.title}</h3>
                      {section.reference && (
                        <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-[#e0c33e]">
                          <p className="text-lg text-[#055160] font-semibold mb-2">{section.reference}</p>
                          {section.arabic && (
                            <p className="text-xl text-[#033642] mb-2 font-arabic" dir="rtl" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{section.arabic}</p>
                          )}
                          {section.translation && (
                            <p className="text-lg text-gray-600 italic mb-2">"{section.translation}"</p>
                          )}
                          {section.urdu && (
                            <p className="text-lg text-[#055160] font-urdu" dir="rtl">"{section.urdu}"</p>
                          )}
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.categories.map((category, i) => (
                          <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-[#055160] text-xl">{category.name}</h4>
                            <p className="text-lg text-gray-600">{category.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Zakat;