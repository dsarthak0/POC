export const getAuthHeaders = (token?: string): Record<string, string> => {
    const ts = Date.now().toString();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'appName':      import.meta.env.VITE_APP_NAME       ,
        'packageName':  import.meta.env.VITE_PACKAGE_NAME   ,
        'deviceId':     import.meta.env.VITE_DEVICE_ID      ,
        'appInstallId': import.meta.env.VITE_APP_INSTALL_ID ,
        'timestamp':    ts,
        'xRequestId':  `${import.meta.env.VITE_DEVICE_ID}${ts}`,
        'os':           import.meta.env.VITE_OS             ,
        'source':       import.meta.env.VITE_SOURCE         ,
        'buildNumber':  import.meta.env.VITE_BUILD_NUMBER   ,
        'appVersion':   import.meta.env.VITE_APP_VERSION    ,
        'deviceIp':     import.meta.env.VITE_DEVICE_IP      ,
        'userAgent':    import.meta.env.VITE_USER_AGENT     ,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};