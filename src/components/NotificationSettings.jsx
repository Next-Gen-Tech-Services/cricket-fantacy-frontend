import React, { useState, useEffect } from "react";
import {
  FiBell,
  FiBellOff,
  FiCheck,
  FiX,
  FiLoader,
  FiSettings,
  FiSmartphone,
  FiMonitor,
} from "react-icons/fi";
import notificationService from "../services/notificationService";
import { toast } from "react-hot-toast";
const NotificationSettings = ({ className = "" }) => {
  const [permissionStatus, setPermissionStatus] = useState("default");
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  useEffect(() => {
    checkNotificationStatus();
    loadTokens();
  }, []);
  const checkNotificationStatus = () => {
    const status = notificationService.getPermissionStatus();
    const enabled = notificationService.isNotificationEnabled();
    setPermissionStatus(status);
    setIsEnabled(enabled);
  };
  const loadTokens = async () => {
    try {
      const tokensData = await notificationService.getTokens();
      if (tokensData) {
        setTokens(tokensData.tokens || []);
      }
    } catch (error) {
      console.error("Failed to load tokens:", error);
    }
  };
  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const result = await notificationService.requestPermission();
      if (result.success) {
        setIsEnabled(true);
        setPermissionStatus("granted");
        await loadTokens();
      }
    } catch (error) {
      console.error("Failed to enable notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDisableNotifications = async () => {
    setIsLoading(true);
    try {
      const success = await notificationService.removeToken();
      if (success) {
        setIsEnabled(false);
        await loadTokens();
        toast.success("🔕 Notifications disabled");
      } else {
        toast.error("❌ Failed to disable notifications");
      }
    } catch (error) {
      console.error("Failed to disable notifications:", error);
      toast.error("❌ Error disabling notifications");
    } finally {
      setIsLoading(false);
    }
  };
  const handleTestNotification = async () => {
    setIsLoading(true);
    try {
      await notificationService.sendTestNotification();
    } catch (error) {
      console.error("Failed to send test notification:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const getStatusColor = () => {
    switch (permissionStatus) {
      case "granted":
        return isEnabled ? "text-green-600" : "text-yellow-600";
      case "denied":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };
  const getStatusText = () => {
    switch (permissionStatus) {
      case "granted":
        return isEnabled ? "Enabled" : "Token not saved";
      case "denied":
        return "Permission denied";
      case "unsupported":
        return "Not supported";
      default:
        return "Not enabled";
    }
  };
  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case "android":
      case "ios":
        return <FiSmartphone className="text-blue-500" size={16} />;
      case "web":
      default:
        return <FiMonitor className="text-green-500 " size={16} />;
    }
  };
  if (permissionStatus === "unsupported") {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        {" "}
        <div className="flex items-center space-x-3 ">
          {" "}
          <FiBellOff className="text-gray-400 " size={20} />{" "}
          <div>
            {" "}
            <h3 className="font-medium text-gray-900 ">
              Notifications Not Supported
            </h3>{" "}
            <p className="text-sm text-gray-600 ">
              Your browser doesn't support push notifications.
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>
    );
  }
  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}
    >
      {" "}
      {/* Header */}{" "}
      <div className="p-6 border-b border-gray-100 ">
        {" "}
        <div className="flex items-center justify-between ">
          {" "}
          <div className="flex items-center space-x-3 ">
            {" "}
            <div
              className={`p-2 rounded-lg ${isEnabled ? "bg-green-100" : "bg-gray-100"}`}
            >
              {" "}
              {isEnabled ? (
                <FiBell className="text-green-600 " size={20} />
              ) : (
                <FiBellOff className="text-gray-500 " size={20} />
              )}{" "}
            </div>{" "}
            <div>
              {" "}
              <h3 className="text-lg font-semibold text-gray-900 ">
                Push Notifications
              </h3>{" "}
              <p className={`text-sm ${getStatusColor()}`}>
                {" "}
                Status: {getStatusText()}{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors "
          >
            {" "}
            <FiSettings size={16} />{" "}
            <span className="text-sm ">Advanced</span>{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* Main Content */}{" "}
      <div className="p-6 ">
        {" "}
        <div className="space-y-4 ">
          {" "}
          {/* Enable/Disable Section */}{" "}
          <div className="flex items-center justify-between ">
            {" "}
            <div>
              {" "}
              <h4 className="font-medium text-gray-900 ">
                Match Alerts & Updates
              </h4>{" "}
              <p className="text-sm text-gray-600 ">
                {" "}
                Get notified about match starts, results, and league
                activities{" "}
              </p>{" "}
            </div>{" "}
            <div className="flex items-center space-x-3 ">
              {" "}
              {isEnabled ? (
                <>
                  {" "}
                  <button
                    onClick={handleTestNotification}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 flex items-center space-x-1 "
                  >
                    {" "}
                    {isLoading ? (
                      <FiLoader className="animate-spin " size={14} />
                    ) : (
                      <FiBell size={14} />
                    )}{" "}
                    <span>Test</span>{" "}
                  </button>{" "}
                  <button
                    onClick={handleDisableNotifications}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center space-x-2 "
                  >
                    {" "}
                    {isLoading ? (
                      <FiLoader className="animate-spin " size={16} />
                    ) : (
                      <FiBellOff size={16} />
                    )}{" "}
                    <span>Disable</span>{" "}
                  </button>{" "}
                </>
              ) : (
                <button
                  onClick={handleEnableNotifications}
                  disabled={isLoading || permissionStatus === "denied"}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 "
                >
                  {" "}
                  {isLoading ? (
                    <FiLoader className="animate-spin " size={16} />
                  ) : (
                    <FiBell size={16} />
                  )}{" "}
                  <span>Enable Notifications</span>{" "}
                </button>
              )}{" "}
            </div>{" "}
          </div>{" "}
          {/* Permission Denied Help */}{" "}
          {permissionStatus === "denied" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 ">
              {" "}
              <div className="flex items-start space-x-3 ">
                {" "}
                <FiX
                  className="text-red-500 flex-shrink-0 mt-0.5 "
                  size={18}
                />{" "}
                <div>
                  {" "}
                  <h4 className="font-medium text-red-800 ">
                    Notification Permission Denied
                  </h4>{" "}
                  <p className="text-sm text-red-700 mt-1 ">
                    {" "}
                    To enable notifications, please:{" "}
                  </p>{" "}
                  <ol className="text-sm text-red-700 mt-2 ml-4 list-decimal space-y-1 ">
                    {" "}
                    <li>
                      Click the lock icon in your browser's address bar
                    </li>{" "}
                    <li>Change notifications from "Block " to "Allow "</li>{" "}
                    <li>Refresh this page and try again</li>{" "}
                  </ol>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          )}{" "}
          {/* Advanced Settings */}{" "}
          {showAdvanced && (
            <div className="border-t border-gray-100 pt-4 mt-4 ">
              {" "}
              <h4 className="font-medium text-gray-900 mb-3 ">
                Device Tokens
              </h4>{" "}
              {tokens.length > 0 ? (
                <div className="space-y-2 ">
                  {" "}
                  {tokens.map((token, index) => (
                    <div
                      key={token.id || index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg "
                    >
                      {" "}
                      <div className="flex items-center space-x-3 ">
                        {" "}
                        {getDeviceIcon(token.deviceType)}{" "}
                        <div>
                          {" "}
                          <p className="font-medium text-gray-900 capitalize ">
                            {" "}
                            {token.deviceType} Device{" "}
                          </p>{" "}
                          <p className="text-xs text-gray-500 ">
                            {" "}
                            Added:{" "}
                            {new Date(token.addedAt).toLocaleDateString()}{" "}
                            {token.lastUsed && (
                              <span className="ml-2 ">
                                {" "}
                                • Last used:{" "}
                                {new Date(
                                  token.lastUsed,
                                ).toLocaleDateString()}{" "}
                              </span>
                            )}{" "}
                          </p>{" "}
                        </div>{" "}
                      </div>{" "}
                      <FiCheck className="text-green-500 " size={16} />{" "}
                    </div>
                  ))}{" "}
                </div>
              ) : (
                <div className="text-center py-6 ">
                  {" "}
                  <FiBellOff
                    className="text-gray-400 mx-auto mb-2 "
                    size={24}
                  />{" "}
                  <p className="text-sm text-gray-600 ">
                    No notification tokens found
                  </p>{" "}
                </div>
              )}{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default NotificationSettings;
