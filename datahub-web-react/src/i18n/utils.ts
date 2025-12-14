import i18next from 'i18next';

// 创建一个全局的翻译函数
export const t = (key: string | undefined, options?: any): string => {
    return key ? (i18next.t as any)(key, options) : '' as string;
};

// 创建一个全局的格式化数字函数
export const formatNumber = (num: number, options?: any): string => {
    return (i18next.t as any)('number', { value: num, ...options }) as string;
};

// 创建一个全局的格式化日期函数
export const formatDate = (date: Date | string, options?: any): string => {
    return (i18next.t as any)('date', { value: date, ...options }) as string;
};

// 创建一个全局的格式化时间函数
export const formatTime = (time: Date | string, options?: any): string => {
    return (i18next.t as any)('time', { value: time, ...options }) as string;
};

// 创建一个全局的格式化货币函数
export const formatCurrency = (amount: number, currency: string, options?: any): string => {
    return (i18next.t as any)('currency', { value: amount, currency, ...options }) as string;
};