import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Palette,
  Bell,
  Shield,
  Save,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Info
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../auth/hook/useAuth';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const { handleLogoutUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleUIOnlyInfo = () => {
    toast('Settings coming soon.', {
      icon: <Info className="h-5 w-5 text-indigo-400" />,
      style: {
        background: 'var(--color-surface-light)',
        color: '#fff',
        border: '1px solid var(--color-border)'
      }
    });
  };

  const handleSave = () => {
    handleUIOnlyInfo();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>

            <div className="flex items-center gap-6 mb-8">
              <div className="h-24 w-24 rounded-full bg-indigo-500/20 border-2 border-indigo-500/50 flex items-center justify-center relative overflow-hidden">
                <span className="text-3xl font-bold text-indigo-400">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <button onClick={handleUIOnlyInfo} className="px-4 py-2 bg-[var(--color-surface-light)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg transition-colors border border-[var(--color-border)] mb-2">
                  Change Avatar
                </button>
                <p className="text-sm text-[var(--color-text-muted)]">
                  JPG, GIF or PNG. 1MB max.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-dim)]">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || ''}
                  className="w-full bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-dim)]">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  className="w-full bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="john@example.com"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-dim)]">Role</label>
                <input
                  type="text"
                  defaultValue={user?.role || ''}
                  className="w-full bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-white opacity-70 cursor-not-allowed capitalize"
                  disabled
                />
              </div>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Appearance</h2>

            <div className="space-y-4">
              <label className="text-sm font-medium text-[var(--color-text-dim)]">Theme Preference</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button onClick={handleUIOnlyInfo} className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white">
                  <Moon className="h-5 w-5 text-indigo-400" />
                  <span className="font-medium">Dark (Default)</span>
                </button>
                <button onClick={handleUIOnlyInfo} className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-light)] text-[var(--color-text-dim)] hover:text-white hover:border-gray-600 transition-colors opacity-50 cursor-not-allowed">
                  <Sun className="h-5 w-5" />
                  <span className="font-medium">Light</span>
                </button>
                <button onClick={handleUIOnlyInfo} className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-light)] text-[var(--color-text-dim)] hover:text-white hover:border-gray-600 transition-colors opacity-50 cursor-not-allowed">
                  <Monitor className="h-5 w-5" />
                  <span className="font-medium">System</span>
                </button>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                Light mode is currently disabled in this version.
              </p>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>

            <div className="space-y-4">
              {[
                { title: 'Email Notifications', desc: 'Receive daily summary emails' },
                { title: 'Push Notifications', desc: 'Get real-time alerts in browser' },
                { title: 'New Ticket Alerts', desc: 'Notify when a new ticket is assigned to you' },
                { title: 'Chat Messages', desc: 'Notify on new chat messages' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-light)]">
                  <div>
                    <h3 className="text-white font-medium">{item.title}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked={idx !== 0} onChange={handleUIOnlyInfo} />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-light)] flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Change Password</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">Update your account password</p>
                </div>
                <button onClick={handleUIOnlyInfo} className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-border)] text-white rounded-lg transition-colors text-sm shrink-0">
                  Update
                </button>
              </div>

              <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-light)] flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">Add an extra layer of security</p>
                </div>
                <button onClick={handleUIOnlyInfo} className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-colors text-sm shrink-0">
                  Enable
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                <h3 className="text-red-400 font-medium mb-2">Danger Zone</h3>
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  <div>
                    <h4 className="text-white">Delete Account</h4>
                    <p className="text-sm text-[var(--color-text-muted)]">Permanently delete your account and data</p>
                  </div>
                  <button onClick={handleUIOnlyInfo} className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors text-sm shrink-0">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-[var(--color-text-dim)] mt-1">Manage your account preferences and settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${isActive
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'text-[var(--color-text-dim)] hover:text-white hover:bg-[var(--color-surface-light)] border border-transparent'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}

            <div className="hidden lg:block h-px w-full bg-[var(--color-border)] my-4"></div>

            <button
              onClick={handleLogoutUser}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 border border-transparent transition-colors whitespace-nowrap"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 glass p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]"
        >
          {renderContent()}

          {/* Save Button */}
          {activeTab !== 'security' && (
            <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed glow-primary"
              >
                {isSaving ? (
                  <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
