export const translations = {
  vi: {
    // Sidebar
    dashboard: "Bảng điều khiển (Dashboard)",
    accounts_overview: "Tổng quan Tài khoản (Accounts Overview)",
    add_platform: "Thêm Nền tảng (Add Platform)",
    settings: "Cài đặt (Settings)",

    // Dashboard
    total_active_accounts: "Tổng Tài khoản (Total Accounts)",
    avg_quota_remaining: "Quota Trung bình (Avg Quota)",
    avg_burn_rate: "Tốc độ Tiêu hao (Burn Rate)",
    global_quota_history: "Lịch sử Tiêu thụ Quota (Quota History)",

    // Accounts
    refresh: "Làm mới (Refresh)",
    quota_remaining: "Quota Còn lại (Remaining)",
    
    // Add Platform
    add_new_platform: "Thêm Nền tảng Mới (Add New Platform)",
    platform: "Nền tảng (Platform)",
    account_name: "Tên Tài khoản / Bí danh (Account Name)",
    plan_type: "Loại Gói (Plan Type)",
    session_token: "Session Token (Cookie)",
    session_token_help: "Cần thiết để quét quota nếu không có API key (Required for web scraping quota).",
    api_key_optional: "API Key (Tùy chọn / Optional)",
    save_account: "Lưu Tài khoản (Save Account)",
    account_added_success: "Đã thêm tài khoản thành công! (Account added successfully!)",
    error_saving: "Lỗi kết nối Backend. (Lưu tạm/Mock mode)",

    // Settings
    sync_preferences: "Tùy chọn Đồng bộ (Sync Preferences)",
    sync_desc: "Cấu hình tần suất Backend kiểm tra cập nhật quota (Configure cronjob interval).",
    sync_interval: "Chu kỳ Đồng bộ (Sync Interval)",
    every_15_min: "Mỗi 15 phút (Every 15 mins)",
    every_30_min: "Mỗi 30 phút (Every 30 mins)",
    every_1_hour: "Mỗi 1 giờ (Every 1 hour)",
    every_2_hours: "Mỗi 2 giờ (Every 2 hours)",
    once_a_day: "Mỗi ngày 1 lần (Once a day)",
    alert_threshold: "Ngưỡng Cảnh báo (Alert Threshold)",
    quota_remaining_label: "% quota còn lại (% quota remaining)",
    alert_help: "Hiển thị màu đỏ khi quota dưới mức này (Highlight in red below this).",
    save_preferences: "Lưu Cấu hình (Save Preferences)",
    settings_saved: "Đã lưu cài đặt! (Settings saved!)"
  },
  en: {
    // Sidebar
    dashboard: "Dashboard",
    accounts_overview: "Accounts Overview",
    add_platform: "Add Platform",
    settings: "Settings",

    // Dashboard
    total_active_accounts: "Total Active Accounts",
    avg_quota_remaining: "Avg Quota Remaining",
    avg_burn_rate: "Avg Burn Rate (Daily)",
    global_quota_history: "Global Quota Burn History",

    // Accounts
    refresh: "Refresh",
    quota_remaining: "Quota Remaining",
    
    // Add Platform
    add_new_platform: "Add New Platform",
    platform: "Platform",
    account_name: "Account Name (Alias)",
    plan_type: "Plan Type",
    session_token: "Session Token (Cookie)",
    session_token_help: "Required for web scraping quota if API key is not available.",
    api_key_optional: "API Key (Optional)",
    save_account: "Save Account",
    account_added_success: "Account added successfully!",
    error_saving: "Error connecting to backend. (Mock mode: Pretend it saved!)",

    // Settings
    sync_preferences: "Synchronization Preferences",
    sync_desc: "Configure how often the backend cronjob polls for quota updates.",
    sync_interval: "Sync Interval (Minutes)",
    every_15_min: "Every 15 minutes",
    every_30_min: "Every 30 minutes",
    every_1_hour: "Every 1 hour",
    every_2_hours: "Every 2 hours",
    once_a_day: "Once a day",
    alert_threshold: "Alert Threshold",
    quota_remaining_label: "% quota remaining",
    alert_help: "Highlight accounts in red when quota falls below this percentage.",
    save_preferences: "Save Preferences",
    settings_saved: "Settings saved!"
  }
};
