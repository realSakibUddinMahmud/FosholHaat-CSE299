import type { Locale } from "./auth";

export type SharedAuthCopy = {
  common: {
    appName: string;
    support: string;
    privacy: string;
    terms: string;
    contact: string;
    languageSwitch: string;
    english: string;
    bangla: string;
    copyright: string;
  };
  welcome: {
    heroOverline: string;
    heroTitleLead: string;
    heroTitleAccent: string;
    heroTitleTail: string;
    heroSubtitle: string;
    title: string;
    subtitle: string;
    helper: string;
    login: string;
    createAccount: string;
    chooseLanguage: string;
    footer: string;
  };
  language: {
    title: string;
    subtitle: string;
    helper: string;
    heroOverline: string;
    heroTitle: string;
    heroTitleLead?: string;
    heroTitleTail?: string;
    heroSubtitle: string;
    trustTitle: string;
    trustPointOne: string;
    trustPointTwo: string;
    stepLabel: string;
    continue: string;
    englishTitle: string;
    englishHint: string;
    banglaTitle: string;
    banglaHint: string;
    supportText: string;
    supportHint: string;
  };
  login: {
    title: string;
    subtitle: string;
    heroOverline: string;
    heroTitleLead: string;
    heroTitleAccent: string;
    heroSubtitle: string;
    sourceCorridor: string;
    destination: string;
    sourceLabel: string;
    destinationLabel: string;
    cardTitle: string;
    cardSubtitle: string;
    identifierLabel: string;
    identifierPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    forgot: string;
    submit: string;
    submitLoading: string;
    createAccountPrompt: string;
    createAccountLink: string;
    missingCredentials: string;
    invalidCredentials: string;
    connectionFailed: string;
    missingDestination: string;
    hidePassword: string;
    showPassword: string;
  };
  signupRole: {
    title: string;
    subtitle: string;
    heroOverline: string;
    heroTitleLead: string;
    heroTitleAccent: string;
    heroTitleTail: string;
    heroSubtitle: string;
    featureOneTitle: string;
    featureOneDescription: string;
    featureTwoTitle: string;
    featureTwoDescription: string;
    buyerTitle: string;
    buyerDescription: string;
    sellerTitle: string;
    sellerDescription: string;
    hubTitle: string;
    hubDescription: string;
    select: string;
    continue: string;
    loginPrompt: string;
    loginLink: string;
    saveError: string;
    connectionFailed: string;
    hubUnavailable: string;
    missingRoute: string;
  };
  buyerSignup: {
    title: string;
    subtitle: string;
    businessName: string;
    businessNamePlaceholder: string;
    businessType: string;
    businessTypePlaceholder: string;
    contactPerson: string;
    contactPersonPlaceholder: string;
    phoneNumber: string;
    location: string;
    locationPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    submit: string;
    loginPrompt: string;
    loginLink: string;
  };
  sellerSignup: {
    title: string;
    subtitle: string;
    businessName: string;
    businessNamePlaceholder: string;
    tradeFocus: string;
    tradeFocusPlaceholder: string;
    contactPerson: string;
    contactPersonPlaceholder: string;
    phoneNumber: string;
    collectionArea: string;
    collectionAreaPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    submit: string;
    loginPrompt: string;
    loginLink: string;
  };
};

export const SHARED_AUTH_COPY: Record<Locale, SharedAuthCopy> = {
  en: {
    common: {
      appName: "FosholHaat",
      support: "Support",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      contact: "Contact",
      languageSwitch: "English | বাংলা",
      english: "English",
      bangla: "বাংলা",
      copyright: "(c) 2026 FosholHaat. Shared entry for Bangladesh produce trade.",
    },
    welcome: {
      heroOverline: "For everyday produce business",
      heroTitleLead: "Start buying and",
      heroTitleAccent: "selling produce",
      heroTitleTail: "easily",
      heroSubtitle: "From one place, log in, open an account, and move into your daily work.",
      title: "Start produce trade the simple way",
      subtitle: "Buyers, sellers, and hub teams all enter from one simple place.",
      helper: "Choose what you need now. After login, FosholHaat takes you to the right workspace.",
      login: "Log In",
      createAccount: "Create Account",
      chooseLanguage: "Need to change language first?",
      footer: "Clear entry, simple language, and the right path into your work.",
    },
    language: {
      title: "Choose your language",
      subtitle: "Pick the language that feels easiest. You can change it later.",
      helper: "The app will keep using this choice until you change it.",
      heroOverline: "Choose the language you know best",
      heroTitle: "Use the language that feels easy.",
      heroTitleLead: "Use the language",
      heroTitleTail: "that feels easy.",
      heroSubtitle:
        "Pick Bangla or English now so the next steps are easier to follow.",
      trustTitle: "Made for simple produce work",
      trustPointOne: "Easy steps to follow",
      trustPointTwo: "Clear buying and selling",
      stepLabel: "Step 1 of 3",
      continue: "Continue",
      englishTitle: "English",
      englishHint: "Everything will show in English.",
      banglaTitle: "বাংলা",
      banglaHint: "সবকিছু বাংলায় দেখাবে।",
      supportText: "Need help? Contact support.",
      supportHint: "We can guide you in English or Bangla.",
    },
    login: {
      title: "Log in to your account",
      subtitle: "Use your phone number or email to enter your work area.",
      heroOverline: "For daily buying and selling work",
      heroTitleLead: "Log in and",
      heroTitleAccent: "see your work",
      heroSubtitle:
        "Use your phone or email to get back to buying, selling, and delivery updates.",
      sourceCorridor: "Bogura -> Dhaka",
      destination: "Potato, onion, vegetables",
      sourceLabel: "Initial trade corridor",
      destinationLabel: "First trade categories",
      cardTitle: "Welcome back",
      cardSubtitle: "Access your agrarian workspace and keep trade movement in view.",
      identifierLabel: "Phone or Email",
      identifierPlaceholder: "Enter your phone or email",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      forgot: "Forgot password?",
      submit: "Log In",
      submitLoading: "Logging in...",
      createAccountPrompt: "New here?",
      createAccountLink: "Create Account",
      missingCredentials: "Enter both your phone or email and your password.",
      invalidCredentials: "Phone, email, or password did not match.",
      connectionFailed: "Connection failed. Please check your internet and try again.",
      missingDestination: "Login worked, but the next workspace was not returned.",
      hidePassword: "Hide password",
      showPassword: "Show password",
    },
    signupRole: {
      title: "Choose the work you do",
      subtitle: "Choose the role that matches your work. We will take you to the right signup step.",
      heroOverline: "For everyday produce trade",
      heroTitleLead: "Choose your",
      heroTitleAccent: "buyer or seller role",
      heroTitleTail: "here.",
      heroSubtitle:
        "FosholHaat helps buyers and sellers work with known businesses, clear prices, and easier produce movement.",
      featureOneTitle: "Know who you trade with",
      featureOneDescription:
        "See which business you are dealing with before work starts.",
      featureTwoTitle: "Price and delivery updates",
      featureTwoDescription:
        "Know price changes and where the produce is going.",
      buyerTitle: "Buyer",
      buyerDescription: "Buy produce for a shop, hotel, restaurant, or business.",
      sellerTitle: "Seller",
      sellerDescription: "Sell produce or manage supply for your business.",
      hubTitle: "Hub Manager",
      hubDescription: "Manage collection, sorting, and logistics at the hub.",
      select: "Choose",
      continue: "Continue",
      loginPrompt: "Already have an account?",
      loginLink: "Log In",
      saveError: "Your role could not be saved.",
      connectionFailed: "Connection failed. Please try again.",
      hubUnavailable: "Hub manager signup is not open yet.",
      missingRoute: "The next registration step was not returned.",
    },
    buyerSignup: {
      title: "Create your buyer account",
      subtitle: "Give the main business details to start buying.",
      businessName: "Business Name",
      businessNamePlaceholder: "Green Groceries Ltd.",
      businessType: "Business Type",
      businessTypePlaceholder: "Retail, hotel, restaurant, wholesale",
      contactPerson: "Contact Person",
      contactPersonPlaceholder: "The person in charge",
      phoneNumber: "Phone Number",
      location: "Business Location",
      locationPlaceholder: "City, area",
      password: "Password",
      passwordPlaceholder: "Minimum 8 characters",
      submit: "Create Buyer Account",
      loginPrompt: "Already have an account?",
      loginLink: "Log In",
    },
    sellerSignup: {
      title: "Create your seller account",
      subtitle: "Give the main supply details to start selling.",
      businessName: "Business Name",
      businessNamePlaceholder: "Produce supply business",
      tradeFocus: "Main Products",
      tradeFocusPlaceholder: "Potato, onion, vegetables",
      contactPerson: "Contact Person",
      contactPersonPlaceholder: "Owner or person in charge",
      phoneNumber: "Phone Number",
      collectionArea: "Collection Area",
      collectionAreaPlaceholder: "Bogura, Dhaka, or nearby area",
      password: "Password",
      passwordPlaceholder: "Minimum 8 characters",
      submit: "Create Seller Account",
      loginPrompt: "Already have an account?",
      loginLink: "Log In",
    },
  },
  bn: {
    common: {
      appName: "FosholHaat",
      support: "সাহায্য",
      privacy: "গোপনীয়তা",
      terms: "ব্যবহারের নিয়ম",
      contact: "যোগাযোগ",
      languageSwitch: "বাংলা | English",
      english: "English",
      bangla: "বাংলা",
      copyright: "(c) 2026 FosholHaat। বাংলাদেশের কৃষিপণ্যের ব্যবসার সহজ প্রবেশপথ।",
    },
    welcome: {
      heroOverline: "প্রতিদিনের কৃষিপণ্যের ব্যবসার জন্য",
      heroTitleLead: "সহজে",
      heroTitleAccent: "কৃষিপণ্য কেনাবেচা",
      heroTitleTail: "শুরু করুন",
      heroSubtitle: "এক জায়গা থেকে লগইন করুন, নতুন অ্যাকাউন্ট খুলুন, আর নিজের কাজের জায়গায় যান।",
      title: "সহজে কৃষিপণ্যের ব্যবসা শুরু করুন",
      subtitle: "ক্রেতা, বিক্রেতা, আর হাব টিম সবাই এখান থেকেই ঢোকে।",
      helper: "এখন যা দরকার, সেটা নিন। লগইন করলে আমরা ঠিক কাজের জায়গায় নিয়ে যাই।",
      login: "লগইন করুন",
      createAccount: "অ্যাকাউন্ট খুলুন",
      chooseLanguage: "আগে ভাষা ঠিক করতে চান?",
      footer: "সহজ ভাষা, একটাই প্রবেশপথ, আর সোজা কাজের পথে যাওয়া।",
    },
    language: {
      title: "কোন ভাষায় দেখতে চান?",
      subtitle: "যে ভাষায় সহজ লাগে, সেটা নিন। পরে চাইলে বদলাতে পারবেন।",
      helper: "এখন থেকে অ্যাপে এই ভাষাই দেখাবে, যতক্ষণ না বদলান।",
      heroOverline: "যে ভাষা সহজ লাগে, সেটা নিন",
      heroTitle: "যে ভাষা আপনি ভালো বোঝেন, সেটা নিন।",
      heroTitleLead: "যে ভাষা",
      heroTitleTail: "আপনি ভালো বোঝেন, সেটা নিন।",
      heroSubtitle:
        "এখন বাংলা বা ইংরেজি বেছে নিন, তাহলে পরের ধাপগুলো বুঝতে সহজ হবে।",
      trustTitle: "সহজে কাজ করার জন্য",
      trustPointOne: "ধাপে ধাপে বোঝা যায়",
      trustPointTwo: "কেনাবেচার কথা সহজ ভাষায়",
      stepLabel: "৩ ধাপের ১ম ধাপ",
      continue: "এগিয়ে যান",
      englishTitle: "English",
      englishHint: "সব লেখা ইংরেজিতে দেখাবে।",
      banglaTitle: "বাংলা",
      banglaHint: "সব লেখা বাংলায় দেখাবে।",
      supportText: "সাহায্য লাগলে সাপোর্টে কথা বলুন।",
      supportHint: "বাংলা বা ইংরেজি, দুই ভাষাতেই আমরা সাহায্য করব।",
    },
    login: {
      title: "আপনার অ্যাকাউন্টে ঢুকুন",
      subtitle: "ফোন নম্বর বা ইমেইল দিয়ে নিজের কাজের জায়গায় ঢুকুন।",
      heroOverline: "প্রতিদিনের কেনাবেচার কাজের জন্য",
      heroTitleLead: "লগইন করে",
      heroTitleAccent: "নিজের কাজ দেখুন",
      heroSubtitle:
        "ফোন নম্বর বা ইমেইল দিয়ে ঢুকে কেনাবেচা আর পণ্য যাওয়ার খবর দেখুন।",
      sourceCorridor: "বগুড়া -> ঢাকা",
      destination: "আলু, পেঁয়াজ, সবজি",
      sourceLabel: "শুরুর কাজের এলাকা",
      destinationLabel: "শুরুর পণ্যের ধরন",
      cardTitle: "আবার স্বাগতম",
      cardSubtitle: "নিজের কাজের জায়গায় ঢুকে লেনদেনের অবস্থা সহজে দেখুন।",
      identifierLabel: "ফোন বা ইমেইল",
      identifierPlaceholder: "ফোন নম্বর বা ইমেইল লিখুন",
      passwordLabel: "পাসওয়ার্ড",
      passwordPlaceholder: "পাসওয়ার্ড লিখুন",
      forgot: "পাসওয়ার্ড ভুলে গেছেন?",
      submit: "লগইন",
      submitLoading: "লগইন হচ্ছে...",
      createAccountPrompt: "এখানে নতুন?",
      createAccountLink: "নতুন অ্যাকাউন্ট",
      missingCredentials: "ফোন বা ইমেইল আর পাসওয়ার্ড দুটোই লিখুন।",
      invalidCredentials: "ফোন, ইমেইল, বা পাসওয়ার্ড ঠিক মেলেনি।",
      connectionFailed: "সংযোগ পাওয়া যাচ্ছে না। ইন্টারনেট দেখে আবার চেষ্টা করুন।",
      missingDestination: "লগইন হয়েছে, কিন্তু পরের জায়গা পাওয়া যায়নি।",
      hidePassword: "পাসওয়ার্ড লুকান",
      showPassword: "পাসওয়ার্ড দেখান",
    },
    signupRole: {
      title: "আপনি কোন কাজ করেন?",
      subtitle: "যে কাজটা করেন, সেটা বেছে নিন। আমরা আপনাকে ঠিক সাইনআপ ধাপে নিয়ে যাব।",
      heroOverline: "প্রতিদিনের কৃষিপণ্য কেনাবেচার জন্য",
      heroTitleLead: "আপনার",
      heroTitleAccent: "কাজের ধরন",
      heroTitleTail: "বেছে নিন",
      heroSubtitle:
        "FosholHaat ক্রেতা আর বিক্রেতাকে চেনা ব্যবসা, ঠিক দাম, আর সহজ পণ্য চলাচলের খবর দিয়ে কাজ করতে সাহায্য করে।",
      featureOneTitle: "কাজ শুরুর আগে কে আছে জানুন",
      featureOneDescription: "লেনদেনের আগে কোন ব্যবসার সাথে কাজ করছেন তা বুঝুন।",
      featureTwoTitle: "দাম আর মাল যাওয়ার খবর",
      featureTwoDescription: "দাম বদল আর পণ্য কোথায় যাচ্ছে তা সহজে জানুন।",
      buyerTitle: "ক্রেতা",
      buyerDescription: "দোকান, হোটেল, রেস্তোরাঁ, বা ব্যবসার জন্য পণ্য কেনেন।",
      sellerTitle: "বিক্রেতা",
      sellerDescription: "পণ্য বিক্রি করেন বা অন্যের কাছে সরবরাহ দেন।",
      hubTitle: "হাব ম্যানেজার",
      hubDescription: "পণ্য তোলা, বাছাই, আর যাতায়াতের কাজ দেখেন।",
      select: "বেছে নিন",
      continue: "এগিয়ে যান",
      loginPrompt: "আগেই অ্যাকাউন্ট আছে?",
      loginLink: "লগইন",
      saveError: "আপনার পছন্দ রাখা গেল না।",
      connectionFailed: "সংযোগ পাওয়া যাচ্ছে না। আবার চেষ্টা করুন।",
      hubUnavailable: "হাব ম্যানেজার সাইনআপ এখনো খোলা হয়নি।",
      missingRoute: "পরের ধাপ পাওয়া যায়নি।",
    },
    buyerSignup: {
      title: "ক্রেতার অ্যাকাউন্ট খুলুন",
      subtitle: "কেনাকাটা শুরু করতে ব্যবসার দরকারি তথ্য দিন।",
      businessName: "ব্যবসার নাম",
      businessNamePlaceholder: "যেমন: ভাই ভাই ট্রেডার্স",
      businessType: "ব্যবসার ধরন",
      businessTypePlaceholder: "খুচরা, হোটেল, রেস্তোরাঁ, পাইকারি",
      contactPerson: "যিনি দেখভাল করেন",
      contactPersonPlaceholder: "যিনি কথা বলবেন",
      phoneNumber: "ফোন নম্বর",
      location: "ব্যবসার ঠিকানা",
      locationPlaceholder: "শহর, এলাকা",
      password: "পাসওয়ার্ড",
      passwordPlaceholder: "কমপক্ষে ৮ অক্ষর",
      submit: "ক্রেতার অ্যাকাউন্ট খুলুন",
      loginPrompt: "আগেই অ্যাকাউন্ট আছে?",
      loginLink: "লগইন",
    },
    sellerSignup: {
      title: "বিক্রেতার অ্যাকাউন্ট খুলুন",
      subtitle: "বিক্রি শুরু করতে ব্যবসার দরকারি তথ্য দিন।",
      businessName: "ব্যবসার নাম",
      businessNamePlaceholder: "যেমন: রহমান এন্টারপ্রাইজ",
      tradeFocus: "কোন পণ্য নিয়ে কাজ করেন",
      tradeFocusPlaceholder: "আলু, পেঁয়াজ, সবজি",
      contactPerson: "যিনি দেখভাল করেন",
      contactPersonPlaceholder: "মালিক বা যিনি কথা বলবেন",
      phoneNumber: "ফোন নম্বর",
      collectionArea: "পণ্য তোলার এলাকা",
      collectionAreaPlaceholder: "বগুড়া, ঢাকা, বা আশেপাশের এলাকা",
      password: "পাসওয়ার্ড",
      passwordPlaceholder: "কমপক্ষে ৮ অক্ষর",
      submit: "বিক্রেতার অ্যাকাউন্ট খুলুন",
      loginPrompt: "আগেই অ্যাকাউন্ট আছে?",
      loginLink: "লগইন",
    },
  },
};

export function getSharedAuthCopy(locale: Locale): SharedAuthCopy {
  return SHARED_AUTH_COPY[locale] ?? SHARED_AUTH_COPY.bn;
}
