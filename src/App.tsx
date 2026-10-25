/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';

type Category = 'all' | 'jalebi' | 'samosas' | 'savouries' | 'combos';
type BranchKey = 'walton' | 'dha' | 'johar' | 'bahria';

interface MenuItem {
  id: string;
  name: string;
  category: Exclude<Category, 'all'>;
  description: string;
  price: number;
  unit: string;
  badge?: string;
  badgeVariant?: 'burgundy' | 'amber' | 'royal';
  image: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
}

interface BranchInfo {
  key: BranchKey;
  shortName: string;
  subtitle: string;
  name: string;
  address: string;
  landmark: string;
  hours: string;
  maps: string;
  phone: string;
  selectLabel: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'saffron-jalebi',
    name: 'Signature Saffron Jalebi',
    category: 'jalebi',
    description: 'Crispy, paper-thin golden coils steeped in saffron and crushed green cardamom nectar.',
    price: 1600,
    unit: '/ kg',
    badge: 'Best Seller',
    badgeVariant: 'burgundy',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1VyZP3CKTWDe5y9AzuvfcPcLPWbdRNq0AM-FRJpUS1e4JIu4cXd7LQHpyg0FSHi8xTd9moTpBiielmysGnIhwvzhxJtenqMWl54sOQ3ZlQby5xprcXyY6l9c5QZ85Ixus_YQlID_PeVxXLEUD43UcRfsW_lKYWsZDBwdABNcuqhIK90hKVy6cBrSfBjDvCnPeaJJImLC7n7Ac2DphOygtZ8gWFib4FP8EBPo_LpsX9RC-W4nAWkgRQYQb0',
  },
  {
    id: 'sugar-free-jalebi',
    name: 'Sugar Free Jalebi',
    category: 'jalebi',
    description: 'The identical crunch, sweetened naturally with organic date and stevia syrup bath.',
    price: 1600,
    unit: '/ kg',
    badge: 'Guilt Free',
    badgeVariant: 'amber',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPxlEva09WO1uequbsuPgp59w3hybWOlq6x1EL3A-S7oAEBVZL83IDfLltQ7CIpWo9mwQHQ4vK1_Cd4ZjLaxLkfYIAiqy-RW3PfoszaC9dxD6hLxgxtimnJ5Tz_r3mfc0TSjmhIlZx0UhvUuIPeqW1JBiZXNxzteZTcAHTA3-2n9ILo7-FhZnWVS0oUvXBd_QP5iNE-J_FTn59mWsbG7yU2RjtEycfMmweooukjSaM3dqyNLEr1Sxi',
  },
  {
    id: 'aloo-samosa',
    name: 'Aloo Samosa',
    category: 'samosas',
    description: 'Spiced heirloom potato, fresh green chilli and roasted cumin inside a flaky hand-pinched crust.',
    price: 70,
    unit: 'each',
    badge: 'Classic Crust',
    badgeVariant: 'burgundy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrU9rfXpTX8E_onl7TCM_FmlVEH8WE-JQ2W5AFACwdozm1MWFmJIv1Lae1XdpoOn7sdKjMtJvnHBEwcwlS_rjUg8Wn-E2KS2vAeXUT02DIsN8ygSOT9mFyF-WEYZmwH7izh6rBJ9cSF4Eckh2CNc8jNVsnq4ap2A7esg0ao4wTP_xDi2nAEsJYMhJ8hIDv8Y-OOb_a5R6Wft4wJkeDGhCyTqjBzfQdrJVpDXJd0WLrpf1QuD4WW3Kt',
  },
  {
    id: 'chicken-samosa',
    name: 'Chicken Samosa',
    category: 'samosas',
    description: 'Tender shredded chicken sautéed with fresh cilantro, sweet onion and coarse black pepper.',
    price: 100,
    unit: 'each',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ_KOCVuyPejgHIm9o-ETTFRbqr8Jq2txdp5JihqKflFBduNj6InIzJMt3a5ZL2ZxTWIfmWIr-3Kqogp-CwKaAKF1O6uE9sFzFRSCjN1Be9UgqQjH1kRKX903oYMdRCdp3ZQC3KL51KIS1j9yQ5r1wFfKNzj92azN-2UEM-YTFx9IjUXqEDHB1zaCXMDCgHHyTq9UPjBsMo4NgdN-wQmL1wRZNiP3zEErhjRs92p804aCDBS1R80hF',
  },
  {
    id: 'crispy-pakoray',
    name: 'Crispy Pakoray',
    category: 'savouries',
    description: 'Seasoned gram-flour fritters with thin potato cuts, mint, and crushed coriander seeds.',
    price: 720,
    unit: '/ kg',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjyFtLWRm0yAxxXd7Q2YVDYuaWdIyuIGM8LrrxURreKwbGv6eRYDWuYV9lOJWJJn_Rlm5k6uY0ocn6YuDXOvKUiIufz74JSCVtpGbBF1yYGFJu2Ozflt6wzTblwmy9vNOheA6rEXVcWNyDYmYzkSLtdtm-PIr0D1iAxYmS_Kbxi2rxvMfWKgSd-jvoptjznXCsKxO-7y_JmXaIYiiA6hEiJIRFiwOINOdqydIdcZUBLvh2PGqc6Q9q',
  },
  {
    id: 'namak-paray',
    name: 'Namak Paray',
    category: 'savouries',
    description: 'Diamond-cut pastry seasoned with ajwain carom and sea salt. The definitive chai companion.',
    price: 720,
    unit: '/ kg',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNO6tMREXqgAkPc4O7pXNPxZaJj0H0o6yyKaku8NdFKZZEy9O01QfnnUqqmgcAy7ubm3lB1JB6LJCZNgNgSOxj2bdC9AzjIzQVQAx-vessR-2vNg7sU5QxSfXXj_6Ydj-1SglpZuvjL3txaPzyTiCfjWUmiwV3DDvwrOTLe575UBbf2eCdBZAZ5a-50dD9vhy3V1Ot8eIPJ9J1uTg85ik3f26E6L9iIWFki8VE02-1BY-IUBrFqbZ4',
  },
  {
    id: 'evening-combo',
    name: 'The Evening Combo',
    category: 'combos',
    description: '0.5 kg hot jalebi, six hand-folded samosas, and house tamarind-mint chutney.',
    price: 1290,
    unit: '/ box',
    badge: 'Patron Favorite',
    badgeVariant: 'amber',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvKRJTs1vwsdIUFYevK7Ml0aNwWnqkRYfR7Qv40EMCEyY40nlzJMQO-NGLNHhaD2wifVZnuPZYJsy3M2BCXzW5RDLz2w93xZupMKTt_Xcto_-aWwwv10tnHn3z9CTk7LuWH9s2zAdOhjxNGv6c36vCU7b7yldQ5CZCul4aHJf1v6qZCC1ma1_MQ_yXPrl797PASEb_l5qEKceHoXWKQ28pUk3raQvYFJY_IJQnUZMB2btTV0aNYxHB',
  },
  {
    id: 'confectioner-gift-box',
    name: 'Grato Confectioner Gift Box',
    category: 'combos',
    description: '1 kg premium jalebi in gold-embossed burgundy tin with velvet ribbon finish.',
    price: 2100,
    unit: '/ box',
    badge: 'Royal Gift Box',
    badgeVariant: 'royal',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1VO4pj6qljc51K8V4sjzWpv2G8xw9coZ4GnvvYTlr7JM2WGsA3hXMVHVqCfTglhbgtq_S_JbBNkLegNcBvXoBsxtkIr-GmboNtxeVIP65WxsjCx50G1hQGqekv_PICy-wF0pA9JZvdh9jePNZxYen0hsQnZqJrWhee-hInbVunVZYPe3XRWLiV9U01yXgsAixTPcF6_XMBJWV5R8PWC-vxsff4Hfl8oLsV3miOJBiS6A6R5u_HhqlASKQ',
  },
];

const BRANCHES: Record<BranchKey, BranchInfo> = {
  walton: {
    key: 'walton',
    shortName: 'Grato Walton',
    subtitle: 'New Super Town, Walton Road',
    name: 'Grato Walton Flagship',
    address: 'New Super Town, Walton Road, Lahore, Punjab, Pakistan',
    landmark: 'Landmark: Near Bhatta Chowk Crossing',
    hours: '11:00 AM – 11:00 PM, Daily',
    maps: 'https://maps.app.goo.gl/cCkJEqzaotv5K7Dm6',
    phone: '+92 305 743 7708',
    selectLabel: 'Walton',
  },
  dha: {
    key: 'dha',
    shortName: 'Grato DHA Phase 2',
    subtitle: 'Commercial Area, Phase 2',
    name: 'Grato DHA Phase 2',
    address: 'Commercial Area, DHA Phase 2, Lahore, Pakistan',
    landmark: 'Landmark: Central Commercial Broadway',
    hours: '11:00 AM – 11:30 PM, Daily',
    maps: 'https://maps.app.goo.gl/cCkJEqzaotv5K7Dm6',
    phone: '+92 305 743 7708',
    selectLabel: 'DHA Phase 2',
  },
  johar: {
    key: 'johar',
    shortName: 'Grato Johar Town',
    subtitle: 'Main Boulevard, Johar Town',
    name: 'Grato Johar Town',
    address: 'Main Boulevard, Johar Town, Lahore, Pakistan',
    landmark: 'Landmark: Opposite Shaukat Khanum Chowk',
    hours: '11:00 AM – 11:00 PM, Daily',
    maps: 'https://maps.app.goo.gl/cCkJEqzaotv5K7Dm6',
    phone: '+92 305 743 7708',
    selectLabel: 'Johar Town',
  },
  bahria: {
    key: 'bahria',
    shortName: 'Grato Bahria Town',
    subtitle: 'Sector C Commercial Area',
    name: 'Grato Bahria Town',
    address: 'Sector C Commercial, Bahria Town, Lahore, Pakistan',
    landmark: 'Landmark: Near Talwar Chowk Sector C',
    hours: '12:00 PM – 11:00 PM, Daily',
    maps: 'https://maps.app.goo.gl/cCkJEqzaotv5K7Dm6',
    phone: '+92 305 743 7708',
    selectLabel: 'Bahria Town',
  },
};

function ProductImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`bg-gradient-to-br from-saffron-mahogany via-primary-container to-deep-burgundy-night flex flex-col items-center justify-center p-4 text-center ${className || ''}`}>
        <span className="material-symbols-outlined text-honey-gold text-3xl mb-1">bakery_dining</span>
        <span className="font-serif text-xs text-creamy-ivory/90 tracking-wide">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedBranch, setSelectedBranch] = useState<BranchKey>('walton');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartNotes, setCartNotes] = useState('');
  const [emptyCartWarning, setEmptyCartWarning] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return MENU_ITEMS;
    return MENU_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const totalCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const addToCart = (item: MenuItem) => {
    setEmptyCartWarning(false);
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          quantity: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const currentBranch = BRANCHES[selectedBranch];

  const formattedWhatsAppMessage = useMemo(() => {
    let msg = `*NEW ORDER - GRATO JALEBI LAHORE*\n`;
    msg += `------------------------------------\n`;
    msg += `*Selected Branch:* ${currentBranch.selectLabel}\n`;
    msg += `------------------------------------\n`;
    msg += `*Items Ordered:*\n`;
    cart.forEach((item) => {
      msg += `• ${item.name} x ${item.quantity} = Rs. ${(
        item.price * item.quantity
      ).toLocaleString()}\n`;
    });
    msg += `------------------------------------\n`;
    msg += `*Subtotal:* Rs. ${totalPrice.toLocaleString()}\n`;
    if (cartNotes.trim()) {
      msg += `*Special Instructions:* ${cartNotes.trim()}\n`;
    }
    msg += `------------------------------------\n`;
    msg += `Please confirm fresh batch availability and delivery schedule.`;
    return msg;
  }, [cart, currentBranch, totalPrice, cartNotes]);

  const whatsappCheckoutUrl = `https://wa.me/923057437708?text=${encodeURIComponent(
    formattedWhatsAppMessage
  )}`;

  const handleCopyOrderSummary = async () => {
    if (cart.length === 0) {
      setEmptyCartWarning(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(formattedWhatsAppMessage);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 2500);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans">
      {/* TOP APP BAR / BRAND HEADER */}
      <header className="bg-deep-burgundy-night/95 backdrop-blur-md text-honey-gold sticky top-0 z-50 border-b border-antique-amber/20 shadow-[0_4px_20px_-2px_rgba(46,11,14,0.3)]">
        <div className="flex justify-between items-center w-full px-8 lg:px-16 py-2.5 max-w-7xl mx-auto">
          {/* Brand Logo Anchor */}
          <a className="flex flex-col group shrink-0" href="#">
            <span className="font-serif text-[22px] leading-[30px] tracking-widest text-honey-gold uppercase font-bold">
              GRATO JALEBI
            </span>
            <span className="font-sans text-[10px] leading-[14px] font-bold text-soft-almond/70 tracking-[0.12em] uppercase">
              Lahore · Since the first spiral
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[12px] leading-[16px] tracking-[0.06em] font-semibold">
            <a
              className="text-honey-gold border-b border-honey-gold pb-1 transition-colors whitespace-nowrap"
              href="#menu"
            >
              Menu
            </a>
            <a
              className="text-creamy-ivory/80 hover:text-honey-gold transition-colors whitespace-nowrap"
              href="#ritual"
            >
              Artisanal Craft
            </a>
            <a
              className="text-creamy-ivory/80 hover:text-honey-gold transition-colors whitespace-nowrap"
              href="#branches"
            >
              Lahore Branches
            </a>
            <a
              className="text-creamy-ivory/80 hover:text-honey-gold transition-colors whitespace-nowrap"
              href="#reviews"
            >
              Reviews
            </a>
            <a
              className="text-creamy-ivory/80 hover:text-honey-gold transition-colors whitespace-nowrap"
              href="#story"
            >
              Story
            </a>
          </nav>

          {/* Trailing Primary & Actions */}
          <div className="flex items-center gap-4 shrink-0">
            <a
              className="hidden sm:inline-flex items-center gap-1.5 text-[12px] leading-[16px] tracking-[0.06em] font-semibold text-creamy-ivory/90 hover:text-honey-gold transition-colors whitespace-nowrap"
              href="tel:+923057437708"
            >
              <span className="material-symbols-outlined text-honey-gold text-lg">
                call
              </span>
              +92 305 743 7708
            </a>
            <a
              className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-honey-gold to-antique-amber text-espresso-charcoal px-4 py-2 rounded text-[12px] leading-[16px] font-bold tracking-wide shadow-sm hover:brightness-105 active:scale-95 transition-all whitespace-nowrap"
              href="https://wa.me/923057437708"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              Order on WhatsApp
            </a>
            {/* Drawer Cart Trigger with Dynamic Badge */}
            <button
              aria-label="Open Shopping Bag"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-creamy-ivory hover:text-honey-gold active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">
                shopping_bag
              </span>
              <span className="absolute top-1 right-0 bg-honey-gold text-espresso-charcoal text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-saffron-mahogany tabular-nums">
                {totalCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-deep-burgundy-night py-12 lg:py-20 border-b border-antique-amber/20 min-h-[540px] sm:min-h-[600px] lg:min-h-[660px] flex flex-col justify-between">
          {/* Expansive Full-Bleed Jalebi Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
            <ProductImage
              alt="Grato Jalebi Background Spirals"
              className="w-full h-full object-cover opacity-20 brightness-105 scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VyZP3CKTWDe5y9AzuvfcPcLPWbdRNq0AM-FRJpUS1e4JIu4cXd7LQHpyg0FSHi8xTd9moTpBiielmysGnIhwvzhxJtenqMWl54sOQ3ZlQby5xprcXyY6l9c5QZ85Ixus_YQlID_PeVxXLEUD43UcRfsW_lKYWsZDBwdABNcuqhIK90hKVy6cBrSfBjDvCnPeaJJImLC7n7Ac2DphOygtZ8gWFib4FP8EBPo_LpsX9RC-W4nAWkgRQYQb0"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-deep-burgundy-night/95 via-deep-burgundy-night/85 to-deep-burgundy-night/95"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-saffron-mahogany/70 via-transparent to-saffron-mahogany/70"></div>
          </div>

          {/* Subtle ambient decorative glow behind content */}
          <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-honey-gold/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-antique-amber/15 rounded-full blur-3xl pointer-events-none z-0"></div>

          {/* Hero Content: Elegant Centered Editorial Layout */}
          <div className="max-w-5xl mx-auto px-8 lg:px-16 text-center flex flex-col items-center space-y-4 relative z-10 my-auto pt-4 pb-2">
            {/* Pure Desi Ghee Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-saffron-mahogany/80 backdrop-blur-md border border-antique-amber/40 rounded-full shadow-md">
              <span className="material-symbols-outlined text-honey-gold text-xs">
                auto_awesome
              </span>
              <span className="text-[10px] leading-[14px] tracking-[0.12em] text-honey-gold uppercase font-bold">
                PURE DESI GHEE · FRIED TO ORDER
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-[38px] leading-[46px] lg:text-[56px] lg:leading-[64px] font-bold text-creamy-ivory tracking-tight max-w-4xl">
              The Art of{' '}
              <span className="italic font-normal text-honey-gold drop-shadow-[0_2px_10px_rgba(245,158,11,0.35)]">
                Perfect
              </span>{' '}
              Jalebi.
            </h1>

            {/* Subtitle */}
            <p className="text-[18px] leading-[28px] text-soft-almond/90 max-w-2xl mx-auto">
              Freshly prepared. Perfectly crispy. Impossible to resist. Hot
              jalebi, hand-folded samosas and traditional savouries — made in
              disciplined micro-batches, all day long.
            </p>

            {/* Metrics Micro-Cards Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 w-full max-w-xl mx-auto">
              <div className="p-3.5 bg-saffron-mahogany/60 backdrop-blur-md border border-antique-amber/30 rounded-lg shadow-sm hover:border-antique-amber/60 transition-colors group text-center">
                <span className="block font-serif text-[22px] leading-[30px] text-honey-gold font-bold group-hover:scale-105 transition-transform tabular-nums">
                  90s
                </span>
                <span className="text-[13px] leading-[20px] text-soft-almond/80 font-medium">
                  in pure desi ghee
                </span>
              </div>
              <div className="p-3.5 bg-saffron-mahogany/60 backdrop-blur-md border border-antique-amber/30 rounded-lg shadow-sm hover:border-antique-amber/60 transition-colors group text-center">
                <span className="block font-serif text-[22px] leading-[30px] text-honey-gold font-bold group-hover:scale-105 transition-transform tabular-nums">
                  24h
                </span>
                <span className="text-[13px] leading-[20px] text-soft-almond/80 font-medium">
                  slow fermentation
                </span>
              </div>
              <div className="p-3.5 bg-saffron-mahogany/60 backdrop-blur-md border border-antique-amber/30 rounded-lg shadow-sm hover:border-antique-amber/60 transition-colors group text-center">
                <span className="block font-serif text-[22px] leading-[30px] text-honey-gold font-bold group-hover:scale-105 transition-transform tabular-nums">
                  0 min
                </span>
                <span className="text-[13px] leading-[20px] text-soft-almond/80 font-medium">
                  never sits or stales
                </span>
              </div>
            </div>

            {/* CTAs & Live Batch Status */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                className="inline-flex items-center gap-2 bg-gradient-to-r from-honey-gold to-antique-amber text-espresso-charcoal px-7 py-3 rounded-lg text-[14px] leading-[18px] tracking-[0.04em] font-bold shadow-[0_4px_16px_-2px_rgba(194,120,3,0.35)] hover:brightness-105 active:scale-95 transition-all"
                href="https://wa.me/923057437708?text=Hello%20Grato%20Jalebi,%20I%20would%20like%20to%20place%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
                Order on WhatsApp
              </a>
              <a
                className="inline-flex items-center gap-2 bg-primary-container/80 backdrop-blur-sm text-creamy-ivory px-7 py-3 rounded-lg text-[14px] leading-[18px] tracking-[0.04em] font-semibold border border-antique-amber/40 hover:bg-saffron-mahogany transition-all shadow-[0_4px_20px_-2px_rgba(46,11,14,0.3)] active:scale-95"
                href="#menu"
              >
                Explore Our Menu
                <span className="material-symbols-outlined text-sm text-honey-gold">
                  arrow_forward
                </span>
              </a>
            </div>

            {/* Live Batch Info */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-deep-burgundy-night/80 backdrop-blur-sm border border-antique-amber/30 text-soft-almond/80 text-[10px] leading-[14px] tracking-[0.12em] font-bold rounded-full uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-honey-gold"></span>
              <span>Batch #42 · Fresh from Kadhai · Rs. 1,600 / kg</span>
            </div>
          </div>

          {/* Refined Marquee Ticker */}
          <div className="border-y border-antique-amber/20 bg-deep-burgundy-night/90 backdrop-blur-sm py-3 overflow-hidden select-none relative z-10 w-full mt-4">
            <div className="animate-marquee whitespace-nowrap text-[14px] leading-[18px] tracking-widest uppercase text-honey-gold font-semibold flex items-center gap-6">
              <span>FRESH</span> <span>•</span>
              <span>HOT</span> <span>•</span>
              <span>CRISPY</span> <span>•</span>
              <span>SWEET</span> <span>•</span>
              <span>AUTHENTIC</span> <span>•</span>
              <span>IRRESISTIBLE</span> <span>•</span>
              <span>HAND-MADE</span> <span>•</span>
              <span>PURE DESI GHEE</span> <span>•</span>
              <span>FRESH</span> <span>•</span>
              <span>HOT</span> <span>•</span>
              <span>CRISPY</span> <span>•</span>
              <span>SWEET</span> <span>•</span>
              <span>AUTHENTIC</span> <span>•</span>
              <span>IRRESISTIBLE</span> <span>•</span>
              <span>HAND-MADE</span> <span>•</span>
              <span>PURE DESI GHEE</span> <span>•</span>
            </div>
          </div>
        </section>

        {/* SECTION: OUR STORY / THE RITUAL */}
        <section
          className="py-20 bg-creamy-ivory border-b border-antique-amber/15"
          id="story"
        >
          <div className="max-w-7xl mx-auto px-8 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[10px] leading-[14px] tracking-[0.12em] uppercase text-antique-amber font-bold block">
                  The Heritage Narrative
                </span>
                <h2 className="font-serif text-[30px] leading-[38px] lg:text-[40px] lg:leading-[48px] font-semibold text-espresso-charcoal">
                  Tradition in{' '}
                  <span className="italic font-normal text-antique-amber">
                    every spiral.
                  </span>
                </h2>
                <div className="w-12 h-0.5 bg-antique-amber"></div>
                <p className="text-[15px] leading-[24px] text-on-surface-variant">
                  Grato Jalebi began with one belief: the jalebi deserves the
                  same reverence as any fine dessert. Not a street-corner
                  afterthought — a ritual.
                </p>
                <p className="text-[15px] leading-[24px] text-on-surface-variant">
                  Our batter ferments overnight. Our syrup is perfumed with
                  saffron and cardamom. Our samosas are folded by hand, batch
                  after batch, so the one you bite into left the oil minutes
                  ago.
                </p>
                <p className="font-serif text-[20px] leading-[32px] italic text-saffron-mahogany pt-2">
                  “Classic taste, held to a modern standard.”
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface p-7 border border-antique-amber/20 rounded shadow-sm hover:border-antique-amber/60 transition-colors">
                  <span className="material-symbols-outlined text-antique-amber text-3xl mb-3">
                    auto_awesome
                  </span>
                  <h3 className="font-serif text-[22px] leading-[30px] font-semibold text-espresso-charcoal mb-2">
                    Wild Overnight Culture
                  </h3>
                  <p className="text-[13px] leading-[20px] text-on-surface-variant">
                    Flour, artisan curd, and natural yeast left to aerate for 24
                    hours to cultivate our signature citrusy tang.
                  </p>
                </div>

                <div className="bg-surface p-7 border border-antique-amber/20 rounded shadow-sm hover:border-antique-amber/60 transition-colors">
                  <span className="material-symbols-outlined text-antique-amber text-3xl mb-3">
                    local_fire_department
                  </span>
                  <h3 className="font-serif text-[22px] leading-[30px] font-semibold text-espresso-charcoal mb-2">
                    The 90-Second Flash Fry
                  </h3>
                  <p className="text-[13px] leading-[20px] text-on-surface-variant">
                    Cooked exclusively in bubbling desi ghee at an exacting
                    temperature to form an amber shell like tempered sugar
                    glass.
                  </p>
                </div>

                <div className="bg-surface p-7 border border-antique-amber/20 rounded shadow-sm hover:border-antique-amber/60 transition-colors">
                  <span className="material-symbols-outlined text-antique-amber text-3xl mb-3">
                    spa
                  </span>
                  <h3 className="font-serif text-[22px] leading-[30px] font-semibold text-espresso-charcoal mb-2">
                    Kashmir Saffron Bath
                  </h3>
                  <p className="text-[13px] leading-[20px] text-on-surface-variant">
                    Dipped in pure cardamom and saffron nectar just long enough
                    to saturate the hollow spiral without losing crunch.
                  </p>
                </div>

                <div className="bg-surface p-7 border border-antique-amber/20 rounded shadow-sm hover:border-antique-amber/60 transition-colors">
                  <span className="material-symbols-outlined text-antique-amber text-3xl mb-3">
                    pan_tool
                  </span>
                  <h3 className="font-serif text-[22px] leading-[30px] font-semibold text-espresso-charcoal mb-2">
                    Small-Batch Integrity
                  </h3>
                  <p className="text-[13px] leading-[20px] text-on-surface-variant">
                    Fried continuously all day. We do not maintain warmers;
                    every box is filled with confections fried in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: INTERACTIVE MENU & ORDERING */}
        <section
          className="py-20 bg-surface border-b border-antique-amber/15"
          id="menu"
        >
          <div className="max-w-7xl mx-auto px-8 lg:px-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] leading-[14px] tracking-[0.12em] uppercase text-antique-amber font-bold">
                Small Batches Only
              </span>
              <h2 className="font-serif text-[30px] leading-[38px] lg:text-[40px] lg:leading-[48px] font-semibold text-espresso-charcoal mt-1">
                Made hot.{' '}
                <span className="italic font-normal text-antique-amber">
                  Served fast.
                </span>
              </h2>
              <p className="text-[15px] leading-[24px] text-on-surface-variant mt-2">
                Every item leaves the fryer in disciplined micro-batches. When
                it sells out, we draw more fresh spirals and samosas — never
                letting anything sit.
              </p>

              {/* Category Filter Micro-Toggles */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {(
                  [
                    { key: 'all', label: 'All Items' },
                    { key: 'jalebi', label: 'Signature Jalebi' },
                    { key: 'samosas', label: 'Hand-Folded Samosas' },
                    { key: 'savouries', label: 'Savouries & Snacks' },
                    { key: 'combos', label: 'Family Combos' },
                  ] as { key: Category; label: string }[]
                ).map((cat) => {
                  const isActive = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`px-4 py-1.5 rounded-full text-[12px] leading-[16px] tracking-[0.06em] font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-primary-container text-creamy-ivory border border-antique-amber/40 shadow-sm'
                          : 'bg-creamy-ivory text-espresso-charcoal hover:bg-soft-almond border border-antique-amber/20'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-creamy-ivory border border-antique-amber/20 rounded p-2.5 flex flex-col justify-between hover:shadow-[0_12px_32px_-4px_rgba(74,21,27,0.12)] hover:border-antique-amber/50 transition-all duration-300 group"
                >
                  <div>
                    <div className="aspect-[4/3] rounded overflow-hidden relative mb-2.5">
                      <ProductImage
                        alt={item.name}
                        src={item.image}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.badge && (
                        <span
                          className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] leading-[14px] tracking-[0.12em] font-bold uppercase rounded ${
                            item.badgeVariant === 'amber'
                              ? 'bg-antique-amber text-espresso-charcoal'
                              : 'bg-saffron-mahogany/90 text-honey-gold'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="px-1">
                      <h3 className="font-serif text-[22px] leading-[30px] font-semibold text-espresso-charcoal">
                        {item.name}
                      </h3>
                      <p className="text-[13px] leading-[20px] text-on-surface-variant mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-antique-amber/15 flex items-center justify-between px-1">
                    <div>
                      <span className="text-[10px] leading-[14px] tracking-[0.12em] font-bold text-on-surface-variant block">
                        PRICE
                      </span>
                      <span className="text-[14px] leading-[18px] font-bold text-saffron-mahogany tabular-nums">
                        Rs. {item.price.toLocaleString()}{' '}
                        <span className="text-xs font-normal">{item.unit}</span>
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-3 py-1.5 bg-primary-container text-creamy-ivory text-[12px] leading-[16px] font-semibold rounded border border-antique-amber/40 hover:bg-saffron-mahogany active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">
                        add
                      </span>{' '}
                      Add
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: ARTISANAL CRAFT - 'FROM BATTER TO BITE' */}
        <section
          className="py-20 bg-saffron-mahogany text-creamy-ivory border-b border-antique-amber/20 relative overflow-hidden"
          id="ritual"
        >
          <div className="max-w-7xl mx-auto px-8 lg:px-16">
            <div className="max-w-xl mb-12">
              <span className="text-[10px] leading-[14px] tracking-[0.12em] uppercase text-honey-gold font-bold">
                The Five Pillars of Mastery
              </span>
              <h2 className="font-serif text-[30px] leading-[38px] lg:text-[40px] lg:leading-[48px] font-semibold text-creamy-ivory mt-1">
                From batter{' '}
                <span className="italic font-normal text-honey-gold">
                  to bite.
                </span>
              </h2>
              <p className="text-[15px] leading-[24px] text-soft-almond/80 mt-2">
                No machinery. No chemical leaveners. A meticulous ritual passed
                through three generations of sweet masters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                {
                  num: '01',
                  title: 'The Mix',
                  desc: 'Fine flour, aged yoghurt and time. Left to naturally ferment overnight until the batter breathes.',
                },
                {
                  num: '02',
                  title: 'The Spiral',
                  desc: 'Piped free-hand into bubbling ghee through hand-stitched linen. Drawn by muscle memory, never cast.',
                },
                {
                  num: '03',
                  title: 'The Fry',
                  desc: 'Ninety seconds in shallow desi ghee at the precise thermal threshold that produces glass-brittle walls.',
                },
                {
                  num: '04',
                  title: 'The Syrup',
                  desc: 'A brisk dip in simmering saffron-infused syrup. Long enough to sweeten the core, brief enough to stay crisp.',
                },
                {
                  num: '05',
                  title: 'The Bite',
                  desc: 'Boxed piping hot and placed in your hands within minutes. The outer crust shatters instantly.',
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="p-4 bg-deep-burgundy-night/60 border border-antique-amber/20 rounded relative flex flex-col justify-between"
                >
                  <span className="font-serif text-[38px] leading-[46px] font-bold text-honey-gold/30 block mb-4 tabular-nums">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-serif text-[22px] leading-[30px] font-semibold text-honey-gold mb-1">
                      {step.title}
                    </h3>
                    <p className="text-[13px] leading-[20px] text-soft-almond/80">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: VERIFIED LAHORE BRANCHES */}
        <section
          className="py-20 bg-surface border-b border-antique-amber/15"
          id="branches"
        >
          <div className="max-w-7xl mx-auto px-8 lg:px-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-[10px] leading-[14px] tracking-[0.12em] uppercase text-antique-amber font-bold">
                  Lahore Presence
                </span>
                <h2 className="font-serif text-[30px] leading-[38px] lg:text-[40px] lg:leading-[48px] font-semibold text-espresso-charcoal mt-1">
                  Find your nearest{' '}
                  <span className="italic font-normal text-antique-amber">
                    spiral.
                  </span>
                </h2>
              </div>
              <p className="text-[13px] leading-[20px] text-on-surface-variant max-w-md mt-2 md:mt-0">
                Four flagship kitchens active throughout Lahore. Every branch
                maintains its own dedicated fryers and batter fermentation
                cellar.
              </p>
            </div>

            {/* Branch Selector Tabs & Dynamic Display */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Tabs List */}
              <div className="lg:col-span-4 flex flex-col gap-2">
                {(Object.keys(BRANCHES) as BranchKey[]).map((key) => {
                  const branch = BRANCHES[key];
                  const isActive = selectedBranch === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedBranch(key)}
                      className={`text-left p-4 rounded border transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-primary-container text-creamy-ivory border-antique-amber/40 shadow-sm'
                          : 'bg-creamy-ivory text-espresso-charcoal border-antique-amber/20 hover:bg-soft-almond'
                      }`}
                    >
                      <div>
                        <span className="block font-serif text-[22px] leading-[30px] font-semibold">
                          {branch.shortName}
                        </span>
                        <span
                          className={`text-[13px] leading-[20px] ${
                            isActive ? 'opacity-80' : 'text-on-surface-variant'
                          }`}
                        >
                          {branch.subtitle}
                        </span>
                      </div>
                      <span
                        className={`material-symbols-outlined ${
                          isActive ? 'text-honey-gold' : 'text-antique-amber'
                        }`}
                      >
                        chevron_right
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Branch Card Display */}
              <div className="lg:col-span-8 bg-creamy-ivory border border-antique-amber/30 p-7 rounded-lg shadow-sm">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-antique-amber/20 pb-2.5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-antique-amber/15 text-saffron-mahogany rounded text-[10px] leading-[14px] tracking-[0.12em] font-bold mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-antique-amber"></span>
                        LIVE FRYING IN DESI GHEE
                      </div>
                      <h3 className="font-serif text-[28px] leading-[36px] font-semibold text-espresso-charcoal">
                        {currentBranch.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] leading-[14px] tracking-[0.12em] font-bold text-on-surface-variant block uppercase">
                        Operating Hours
                      </span>
                      <span className="text-[15px] leading-[24px] font-semibold text-saffron-mahogany">
                        {currentBranch.hours}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] leading-[14px] tracking-[0.12em] text-antique-amber uppercase font-bold block mb-1">
                        Physical Location
                      </span>
                      <p className="text-[15px] leading-[24px] text-espresso-charcoal">
                        {currentBranch.address}
                      </p>
                      <p className="text-[13px] leading-[20px] text-on-surface-variant mt-1">
                        {currentBranch.landmark}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] leading-[14px] tracking-[0.12em] text-antique-amber uppercase font-bold block mb-1">
                        Direct Kitchen Dispatch
                      </span>
                      <p className="text-[15px] leading-[24px] text-espresso-charcoal font-semibold tabular-nums">
                        {currentBranch.phone}
                      </p>
                      <p className="text-[13px] leading-[20px] text-on-surface-variant mt-1">
                        Estimated local delivery: 25 - 40 minutes in thermal
                        insulated boxes.
                      </p>
                    </div>
                  </div>

                  {/* Map and Quick Action Row */}
                  <div className="pt-2.5 flex flex-wrap gap-4">
                    <a
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-surface border border-antique-amber/40 text-espresso-charcoal text-[12px] leading-[16px] tracking-[0.06em] font-semibold hover:bg-soft-almond transition-colors"
                      href={currentBranch.maps}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="material-symbols-outlined text-antique-amber text-lg">
                        location_on
                      </span>
                      Open Google Maps
                    </a>
                    <a
                      className="inline-flex items-center gap-2 px-7 py-2.5 rounded bg-primary-container text-creamy-ivory text-[12px] leading-[16px] tracking-[0.06em] font-semibold hover:bg-saffron-mahogany active:scale-95 transition-all"
                      href={`https://wa.me/923057437708?text=${encodeURIComponent(
                        `Hello Grato, I would like to order specifically from the ${currentBranch.name}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="material-symbols-outlined text-honey-gold text-lg">
                        chat
                      </span>
                      Order from this Branch
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: EDITORIAL CUSTOMER LOVE & TESTIMONIALS */}
        <section
          className="py-20 bg-creamy-ivory border-b border-antique-amber/15"
          id="reviews"
        >
          <div className="max-w-7xl mx-auto px-8 lg:px-16">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-[10px] leading-[14px] tracking-[0.12em] uppercase text-antique-amber font-bold">
                Patron Chronicle
              </span>
              <h2 className="font-serif text-[30px] leading-[38px] lg:text-[40px] lg:leading-[48px] font-semibold text-espresso-charcoal mt-1">
                Word on{' '}
                <span className="italic font-normal text-antique-amber">
                  the street.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  quote:
                    'Never eat such a delicious jalebi always love to eat Grato Jalebi.',
                  author: 'Mian M. Shahbaz Sharif',
                  location: 'DHA Phase 5, Lahore',
                },
                {
                  quote:
                    'The only jalebi in Lahore that still crackles when it reaches my house.',
                  author: 'Hamza S.',
                  location: 'Bhatta Chowk, Lahore',
                },
                {
                  quote:
                    'We order the evening combo every Friday. It has become a family ritual.',
                  author: 'The Qureshis',
                  location: 'Johar Town, Lahore',
                },
                {
                  quote:
                    'Sugar free jalebi that my father can actually eat. Truly unreal texture.',
                  author: 'Nida A.',
                  location: 'Bahria Town, Lahore',
                },
              ].map((rev, idx) => (
                <div
                  key={idx}
                  className="p-7 bg-surface border border-antique-amber/20 rounded flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <span className="font-serif text-[40px] leading-[48px] text-antique-amber/40 select-none block">
                      “
                    </span>
                    <p className="font-serif text-[20px] leading-[32px] italic text-espresso-charcoal mb-4 -mt-4">
                      {rev.quote}
                    </p>
                  </div>
                  <div className="border-t border-antique-amber/15 pt-3">
                    <span className="block text-[12px] leading-[16px] text-saffron-mahogany font-bold">
                      {rev.author}
                    </span>
                    <span className="text-[10px] leading-[14px] tracking-[0.12em] font-bold text-on-surface-variant uppercase">
                      {rev.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BANNER: ONE MORE BITE CALLOUT */}
        <section className="py-12 bg-deep-burgundy-night text-creamy-ivory text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-8">
            <span className="text-[10px] leading-[14px] tracking-[0.12em] font-bold uppercase text-honey-gold">
              Fresh Kadhai Active
            </span>
            <h2 className="font-serif text-[30px] leading-[38px] lg:text-[40px] lg:leading-[48px] font-semibold text-creamy-ivory mt-2">
              The fryer is on. Your jalebi is thirty minutes away.
            </h2>
            <p className="text-[15px] leading-[24px] text-soft-almond/80 mt-2 max-w-lg mx-auto">
              Fried in pure desi ghee and dispatched piping hot to your table
              anywhere in Lahore.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <a
                className="bg-gradient-to-r from-honey-gold to-antique-amber text-espresso-charcoal px-7 py-3 rounded text-[14px] leading-[18px] tracking-[0.04em] font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
                href="https://wa.me/923057437708?text=Hello%20Grato%20Jalebi,%20I%20would%20like%20to%20order%20now!"
                target="_blank"
                rel="noopener noreferrer"
              >
                Order on WhatsApp Now
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* SLIDE-OVER WHATSAPP CART DRAWER */}
      <div
        onClick={() => setIsCartOpen(false)}
        className={`fixed inset-0 bg-espresso-charcoal/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      <aside
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-creamy-ivory z-50 shadow-2xl flex flex-col transform transition-transform duration-300 border-l border-antique-amber/30 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="bg-saffron-mahogany text-creamy-ivory p-4 flex items-center justify-between border-b border-antique-amber/30">
          <div>
            <h3 className="font-serif text-[22px] leading-[30px] font-semibold text-honey-gold">
              Your Confection Box
            </h3>
            <span className="text-[10px] leading-[14px] tracking-[0.12em] font-bold text-soft-almond/70 uppercase">
              Hand-packed · Fresh from oil
            </span>
          </div>
          <button
            aria-label="Close cart"
            onClick={() => setIsCartOpen(false)}
            className="text-soft-almond hover:text-honey-gold p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Items Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scroll">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-antique-amber/40 mb-2">
                shopping_basket
              </span>
              <p className="text-[15px] leading-[24px]">
                Your confection box is currently empty.
              </p>
              <p className="text-[13px] leading-[20px] text-outline mt-1">
                Select artisanal jalebi or samosas to get started.
              </p>
              {emptyCartWarning && (
                <p className="mt-3 text-xs font-semibold text-error">
                  Please add at least one confection to your cart first.
                </p>
              )}
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-surface p-3 border border-antique-amber/20 rounded flex items-center justify-between"
              >
                <div>
                  <h4 className="text-[12px] leading-[16px] font-semibold text-espresso-charcoal">
                    {item.name}
                  </h4>
                  <span className="text-[13px] leading-[20px] text-saffron-mahogany font-semibold tabular-nums">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-6 h-6 rounded bg-soft-almond text-espresso-charcoal flex items-center justify-center font-bold hover:bg-antique-amber/30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-[13px] leading-[20px] font-bold w-5 text-center tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-6 h-6 rounded bg-soft-almond text-espresso-charcoal flex items-center justify-center font-bold hover:bg-antique-amber/30 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Controls / Summary */}
        <div className="p-4 bg-surface border-t border-antique-amber/20 space-y-3">
          {/* Branch selection inside cart */}
          <div>
            <label
              className="text-[10px] leading-[14px] tracking-[0.12em] font-bold text-espresso-charcoal uppercase block mb-1"
              htmlFor="cartBranchSelect"
            >
              Select Dispatch Kitchen
            </label>
            <select
              id="cartBranchSelect"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value as BranchKey)}
              className="w-full text-[13px] leading-[20px] bg-creamy-ivory border border-antique-amber/30 rounded py-2 px-3 text-espresso-charcoal focus:border-antique-amber focus:outline-none"
            >
              <option value="walton">Grato Walton (New Super Town)</option>
              <option value="dha">Grato DHA Phase 2</option>
              <option value="johar">Grato Johar Town</option>
              <option value="bahria">Grato Bahria Town</option>
            </select>
          </div>

          {/* Optional Special Instructions */}
          <div>
            <label
              className="text-[10px] leading-[14px] tracking-[0.12em] font-bold text-espresso-charcoal uppercase block mb-1"
              htmlFor="cartNotes"
            >
              Special Notes (Extra crisp / separate chutney)
            </label>
            <input
              id="cartNotes"
              type="text"
              value={cartNotes}
              onChange={(e) => setCartNotes(e.target.value)}
              placeholder="e.g. Extra hot jalebi please"
              className="w-full text-[13px] leading-[20px] bg-creamy-ivory border border-antique-amber/30 rounded py-2 px-3 text-espresso-charcoal focus:border-antique-amber focus:outline-none"
            />
          </div>

          {/* Subtotal */}
          <div className="flex items-center justify-between border-t border-antique-amber/20 pt-2 text-espresso-charcoal">
            <span className="text-[14px] leading-[18px] font-semibold">
              Estimated Subtotal
            </span>
            <span className="font-serif text-[22px] leading-[30px] text-saffron-mahogany font-bold tabular-nums">
              Rs. {totalPrice.toLocaleString()}
            </span>
          </div>

          {/* WhatsApp Order Generator CTA */}
          {cart.length > 0 ? (
            <div className="space-y-2">
              <a
                href={whatsappCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-gradient-to-r from-honey-gold to-antique-amber text-espresso-charcoal rounded text-[14px] leading-[18px] font-bold flex items-center justify-center gap-2 shadow hover:brightness-105 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
                Complete Order on WhatsApp
              </a>
              <button
                type="button"
                onClick={handleCopyOrderSummary}
                className="w-full py-2 bg-creamy-ivory border border-antique-amber/30 text-espresso-charcoal rounded text-xs font-semibold hover:bg-soft-almond transition-colors cursor-pointer"
              >
                {copiedNotice
                  ? 'Order Summary Copied to Clipboard'
                  : 'Copy Formatted Order Summary'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEmptyCartWarning(true)}
              className="w-full py-3 bg-gradient-to-r from-honey-gold to-antique-amber text-espresso-charcoal rounded text-[14px] leading-[18px] font-bold flex items-center justify-center gap-2 shadow hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              Complete Order on WhatsApp
            </button>
          )}
          <p className="text-center text-[11px] text-on-surface-variant font-semibold">
            One tap routes formatted request to +92 305 743 7708
          </p>
        </div>
      </aside>

      {/* FOOTER */}
      <footer className="bg-saffron-mahogany text-honey-gold border-t border-antique-amber/20">
        <div className="w-full px-8 lg:px-16 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-7">
          {/* Brand & Copyright */}
          <div className="space-y-2 text-center md:text-left">
            <span className="font-serif text-[22px] leading-[30px] text-honey-gold font-bold tracking-widest uppercase block">
              GRATO JALEBI
            </span>
            <p className="text-[13px] leading-[20px] text-creamy-ivory/80 max-w-md">
              © 2025 Grato Jalebi Lahore. Handcrafted daily in pure desi ghee.
              All rights reserved.
            </p>
          </div>

          {/* Directory Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] leading-[16px] font-semibold text-creamy-ivory/70">
            <a
              onClick={() => setSelectedBranch('walton')}
              className="hover:text-honey-gold transition-colors duration-200 hover:underline underline-offset-4"
              href="#branches"
            >
              Walton Road
            </a>
            <a
              onClick={() => setSelectedBranch('dha')}
              className="hover:text-honey-gold transition-colors duration-200 hover:underline underline-offset-4"
              href="#branches"
            >
              DHA Phase 2
            </a>
            <a
              onClick={() => setSelectedBranch('johar')}
              className="hover:text-honey-gold transition-colors duration-200 hover:underline underline-offset-4"
              href="#branches"
            >
              Johar Town
            </a>
            <a
              onClick={() => setSelectedBranch('bahria')}
              className="hover:text-honey-gold transition-colors duration-200 hover:underline underline-offset-4"
              href="#branches"
            >
              Bahria Town
            </a>
            <a
              className="hover:text-honey-gold transition-colors duration-200 hover:underline underline-offset-4"
              href="#story"
            >
              Heritage &amp; Story
            </a>
            <a
              className="text-honey-gold font-semibold hover:text-honey-gold transition-colors duration-200 hover:underline underline-offset-4"
              href="https://wa.me/923057437708"
              target="_blank"
              rel="noopener noreferrer"
            >
              Direct WhatsApp Concierge
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
