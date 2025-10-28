import React, { useState } from "react";
import {
    Home,
    Users,
    Settings,
    Bell,
    Search,
    Menu,
    X,
    ChevronRight,
    Mail,
    Calendar,
    FileText,
    Folder,
    Download,
    Upload,
    Trash2,
    Edit,
    Save,
    Plus,
    Minus,
    Check,
    AlertCircle,
    Info,
    HelpCircle,
    Star,
    Heart,
    ThumbsUp,
    Share2,
    MessageSquare,
    Send,
    ShoppingCart,
    CreditCard,
    DollarSign,
    TrendingUp,
    BarChart3,
    PieChart,
    Camera,
    Image,
    Video,
    Music,
    Headphones,
    Lock,
    Unlock,
    Eye,
    EyeOff,
    LogOut,
    User,
    Shield,
    Wifi,
    WifiOff,
    Battery,
    BatteryCharging,
    Bluetooth,
    Signal,
    Sun,
    Moon,
    Cloud,
    CloudRain,
    Zap,
    Droplet,
    Globe,
    MapPin,
    Navigation,
    Compass,
    Map,
    Clock,
    Timer,
    AlarmClock,
    Hourglass,
    Package,
    Truck,
    Plane,
    Car,
    Bike,
    Code,
    Terminal,
    Cpu,
    HardDrive,
    Smartphone,
    Laptop,
    Bookmark,
    Tag,
    Flag,
    Award,
    Gift,
    Trophy,
    Coffee,
    Pizza,
    Utensils,
    ShoppingBag,
    Copy,
    CheckCircle2,
} from "lucide-react";

const Icons = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [copiedIcon, setCopiedIcon] = useState("");
    const [viewMode, setViewMode] = useState("grid");

    const iconCategories = {
        Navigation: [
            { Icon: Home, name: "Home" },
            { Icon: Menu, name: "Menu" },
            { Icon: X, name: "Close" },
            { Icon: ChevronRight, name: "ChevronRight" },
            { Icon: Search, name: "Search" },
        ],
        "User & Social": [
            { Icon: Users, name: "Users" },
            { Icon: User, name: "User" },
            { Icon: Heart, name: "Heart" },
            { Icon: ThumbsUp, name: "ThumbsUp" },
            { Icon: Share2, name: "Share" },
            { Icon: MessageSquare, name: "Message" },
            { Icon: Send, name: "Send" },
        ],
        Communication: [
            { Icon: Mail, name: "Mail" },
            { Icon: Bell, name: "Notifications" },
            { Icon: Calendar, name: "Calendar" },
            { Icon: MessageSquare, name: "Chat" },
        ],
        "Files & Documents": [
            { Icon: FileText, name: "File" },
            { Icon: Folder, name: "Folder" },
            { Icon: Download, name: "Download" },
            { Icon: Upload, name: "Upload" },
            { Icon: Trash2, name: "Delete" },
            { Icon: Edit, name: "Edit" },
            { Icon: Save, name: "Save" },
        ],
        Actions: [
            { Icon: Plus, name: "Add" },
            { Icon: Minus, name: "Remove" },
            { Icon: Check, name: "Check" },
            { Icon: Star, name: "Star" },
            { Icon: Bookmark, name: "Bookmark" },
        ],
        "Alerts & Info": [
            { Icon: AlertCircle, name: "Alert" },
            { Icon: Info, name: "Info" },
            { Icon: HelpCircle, name: "Help" },
        ],
        Commerce: [
            { Icon: ShoppingCart, name: "Cart" },
            { Icon: CreditCard, name: "Payment" },
            { Icon: DollarSign, name: "Money" },
            { Icon: Tag, name: "Tag" },
            { Icon: Package, name: "Package" },
        ],
        Analytics: [
            { Icon: TrendingUp, name: "Trending" },
            { Icon: BarChart3, name: "BarChart" },
            { Icon: PieChart, name: "PieChart" },
        ],
        Media: [
            { Icon: Camera, name: "Camera" },
            { Icon: Image, name: "Image" },
            { Icon: Video, name: "Video" },
            { Icon: Music, name: "Music" },
            { Icon: Headphones, name: "Audio" },
        ],
        Security: [
            { Icon: Lock, name: "Lock" },
            { Icon: Unlock, name: "Unlock" },
            { Icon: Eye, name: "Show" },
            { Icon: EyeOff, name: "Hide" },
            { Icon: Shield, name: "Shield" },
            { Icon: LogOut, name: "Logout" },
        ],
        Connectivity: [
            { Icon: Wifi, name: "Wifi" },
            { Icon: WifiOff, name: "No Wifi" },
            { Icon: Battery, name: "Battery" },
            { Icon: BatteryCharging, name: "Charging" },
            { Icon: Bluetooth, name: "Bluetooth" },
            { Icon: Signal, name: "Signal" },
        ],
        Weather: [
            { Icon: Sun, name: "Sun" },
            { Icon: Moon, name: "Moon" },
            { Icon: Cloud, name: "Cloud" },
            { Icon: CloudRain, name: "Rain" },
            { Icon: Zap, name: "Lightning" },
            { Icon: Droplet, name: "Water" },
        ],
        Location: [
            { Icon: Globe, name: "Globe" },
            { Icon: MapPin, name: "Pin" },
            { Icon: Navigation, name: "Navigation" },
            { Icon: Compass, name: "Compass" },
            { Icon: Map, name: "Map" },
        ],
        Time: [
            { Icon: Clock, name: "Clock" },
            { Icon: Timer, name: "Timer" },
            { Icon: AlarmClock, name: "Alarm" },
            { Icon: Hourglass, name: "Hourglass" },
        ],
        Transport: [
            { Icon: Truck, name: "Truck" },
            { Icon: Plane, name: "Plane" },
            { Icon: Car, name: "Car" },
            { Icon: Bike, name: "Bike" },
        ],
        Technology: [
            { Icon: Code, name: "Code" },
            { Icon: Terminal, name: "Terminal" },
            { Icon: Cpu, name: "CPU" },
            { Icon: HardDrive, name: "Storage" },
            { Icon: Smartphone, name: "Phone" },
            { Icon: Laptop, name: "Laptop" },
            { Icon: Settings, name: "Settings" },
        ],
        Rewards: [
            { Icon: Award, name: "Award" },
            { Icon: Trophy, name: "Trophy" },
            { Icon: Gift, name: "Gift" },
            { Icon: Flag, name: "Flag" },
        ],
        Lifestyle: [
            { Icon: Coffee, name: "Coffee" },
            { Icon: Pizza, name: "Food" },
            { Icon: Utensils, name: "Dining" },
            { Icon: ShoppingBag, name: "Shopping" },
        ],
    };

    const allIcons = Object.entries(iconCategories).flatMap(
        ([category, icons]) => icons.map((icon) => ({ ...icon, category }))
    );

    const filteredIcons = allIcons.filter(({ name, category }) => {
        const matchesSearch = name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory =
            activeCategory === "All" || category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ["All", ...Object.keys(iconCategories)];

    const handleCopyIcon = (name) => {
        navigator.clipboard.writeText(`<${name} />`);
        setCopiedIcon(name);
        setTimeout(() => setCopiedIcon(""), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                        <Zap className="text-white" size={32} />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        Icon Library
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Discover and copy {allIcons.length} beautiful Lucide icons
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 relative max-w-2xl mx-auto">
                    <div className="relative">
                        <Search
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search icons by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-slate-700 placeholder-slate-400"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                            Categories
                        </h2>
                        <div className="text-sm text-slate-500">
                            {filteredIcons.length} icons
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-5 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 ${
                                    activeCategory === category
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200"
                                        : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Icons Grid */}
                {filteredIcons.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {filteredIcons.map(({ Icon, name, category }, index) => (
                            <div
                                key={`${name}-${index}`}
                                onClick={() => handleCopyIcon(name)}
                                className="group relative bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:shadow-xl transition-all duration-300 border-2 border-slate-100 hover:border-indigo-200 cursor-pointer transform hover:-translate-y-1"
                            >
                                {/* Copy indicator */}
                                <div className={`absolute top-2 right-2 transition-all duration-300 ${
                                    copiedIcon === name ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                                }`}>
                                    <CheckCircle2 size={16} className="text-green-500" />
                                </div>
                                
                                {/* Icon background gradient on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div className="relative z-10 flex flex-col items-center gap-3">
                                    <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-white transition-colors">
                                        <Icon
                                            size={28}
                                            className="text-slate-600 group-hover:text-indigo-600 transition-all duration-300"
                                            strokeWidth={2}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors block">
                                            {name}
                                        </span>
                                        <span className="text-xs text-slate-400 mt-1 block">
                                            {category}
                                        </span>
                                    </div>
                                </div>

                                {/* Copy button overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 backdrop-blur-sm rounded-2xl z-20">
                                    <div className="flex items-center gap-2 text-indigo-600 font-medium">
                                        {copiedIcon === name ? (
                                            <>
                                                <CheckCircle2 size={18} />
                                                <span className="text-sm">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={18} />
                                                <span className="text-sm">Click to copy</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* No Results */
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
                            <Search className="text-slate-400" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-700 mb-2">
                            No icons found
                        </h3>
                        <p className="text-slate-500 text-lg mb-6">
                            Try a different search term or category
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setActiveCategory("All");
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* Footer Stats */}
                {filteredIcons.length > 0 && (
                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md border-2 border-slate-100">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Zap size={16} className="text-indigo-500" />
                                <span className="font-medium">
                                    Showing {filteredIcons.length} of {allIcons.length} icons
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Icons;