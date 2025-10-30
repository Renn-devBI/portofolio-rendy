import moment from 'moment-timezone';

const getIndonesianTime = () => {
    return moment().tz('Asia/Jakarta').format('dddd, DD MMMM YYYY HH:mm:ss z');
};

export default function handler(req: any, res: any): void {
    res.status(200).json({
        status: 'OK',
        timestamp: getIndonesianTime(),
        emailConfigured: !!process.env.EMAIL_USER
    });
}
