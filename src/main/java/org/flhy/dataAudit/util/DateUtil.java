package org.flhy.dataAudit.util;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import org.apache.commons.lang.StringUtils;

public class DateUtil {
	
	/**
	 * 转换为标准时区小时数
	 */
	public static final int GMT_TIME = -8;
	
	/**
	 * 东八区
	 */
	public static final String GMT8 = "GMT+8";
	
	/**
	 * 标准时区
	 */
	public static final String GMT = "GMT";
	
	public final static String defaultDateFormat = "yyyy-MM-dd HH:mm:ss";
	/**
	 * 时间格式切换
	 * @author Yang Guanlin 2016-3-16 下午03:40:50
	 * @param dateStr
	 * @param strPattern
	 * @param resultPattern
	 * @return
	 * @throws ParseException
	 */
	public static String transfer(String dateStr,String strPattern,String resultPattern) throws ParseException{
		SimpleDateFormat strSdf = new SimpleDateFormat(strPattern);
		SimpleDateFormat resultSdf = new SimpleDateFormat(resultPattern);
		return resultSdf.format(strSdf.parse(dateStr));
	}
	
	public static String dateToString(Date date){
		return dateToString(date,null);
	}
	
	public static String calendarToString(Calendar cal){
		return calendarToString(cal,null);
	}
	
	public static Calendar stringToCalendar(String dateStr){
		return stringToCalendar(dateStr,null);
	}
	
	public static Date stringToDate(String dateStr){
		return stringToDate(dateStr, null);
	}
	
	public static String dateToString(Date date, String dateFormat) {
		if (ObjectUtil.isNullOrEmpty(dateFormat)) {
			dateFormat = defaultDateFormat;
		}
		if (date != null) {
			SimpleDateFormat formatter = new SimpleDateFormat(dateFormat);
			return formatter.format(date);
		}

		return null;
	}
	
	
	public static Timestamp dateToTimestamp(Date date){
		String dateStr = dateToString(date);
		return Timestamp.valueOf(dateStr);
	}
		

	public static String calendarToString(Calendar cal, String dateFormat) {
		if (ObjectUtil.isNullOrEmpty(dateFormat)) {
			dateFormat = defaultDateFormat;
		}
		if (cal != null) {
			SimpleDateFormat formatter = new SimpleDateFormat(dateFormat);
			return formatter.format(cal.getTime());
		}
		return null;
	}

	public static Calendar stringToCalendar(String dateStr, String dateFormat) {
		if (ObjectUtil.isNullOrEmpty(dateFormat)) {
			dateFormat = defaultDateFormat;
		}
		if (!ObjectUtil.isNullOrEmpty(dateStr)) {
			Calendar cal = Calendar.getInstance();
			try {
				Date date = DateUtil.stringToDate(dateStr, dateFormat);
				if (null != date) {
					cal.setTime(date);
				} else {
					cal = null;
				}
			} catch (Exception e) {
				return null;
			}
			return cal;
		} else {
			return null;
		}
	}

	public static Date stringToDate(String dateStr, String dateFormat) {
		if (ObjectUtil.isNullOrEmpty(dateFormat)) {
			dateFormat = defaultDateFormat;
		}
		if (!ObjectUtil.isNullOrEmpty(dateStr)) {
			try {
				return new SimpleDateFormat(dateFormat).parse(dateStr);
			} catch (Exception e) {
				return null;
			}
		} else {
			return null;
		}
	}
	
	public static String getCurrentDate(){
		Date now = new Date();
		return dateToString(now,"yyyyMMddHHmmss");
	}
	
	public static boolean sourceAfterTarget(String dateSource,String dateTarget, String dateFormat) {
		try {
	        if(StringUtils.isNotBlank(dateSource)&&StringUtils.isNotBlank(dateTarget)){
	        	if(StringUtils.isBlank(dateFormat)){
	        		dateFormat = defaultDateFormat;
	        	}
	        	Date source=new SimpleDateFormat(dateFormat).parse(dateSource);
	        	Date target=new SimpleDateFormat(dateTarget).parse(dateSource);
	        	if(source.after(target)){
	        		return true;
	        	}
	        }
        } catch (Exception e) {
	        e.printStackTrace();
        }
		return false;
	}

	/**
	 * 
	 * @author Zhangjiwei 2013-3-9 上午10:42:52
	 * @param beforeFormart
	 * @param afterFormart
	 * @param dateStr
	 * @return
	 * @throws ParseException
	 */
	public static String getUTC(String beforeFormart, String afterFormart, String dateStr) throws ParseException {
		SimpleDateFormat be = new SimpleDateFormat(beforeFormart, Locale.US);
		Date date = be.parse(dateStr);
		
		SimpleDateFormat af = new SimpleDateFormat(afterFormart, Locale.US);
		// af.setTimeZone(TimeZone.getTimeZone("UTC"));
		String dateUtc = af.format(date);
		return dateUtc;
	}	
	
	/**
	 * 转换时区，组装为YYYY-MM-DDTHH:mm:ssZ格式
	 * @author Xie Qiao 2012-11-29 下午04:45:26
	 * @param time
	 * @param dateFormat
	 * @return
	 * @throws ParseException
	 */
	public static String getTimeStr(String time, SimpleDateFormat dateFormat) throws ParseException {
		Date startDate = dateFormat.parse(time);
		String timeStr = dateAddHours(startDate, GMT_TIME, dateFormat);
		String[] startTime = timeStr.split(" ");
		String startTimeStr = startTime[0] + "T" + startTime[1] + "Z";
		return startTimeStr;
	}
	/**
	 * 转换时区，组装为YYYY-MM-DDTHH:mm:ssZ格式
	 * @author Xie Qiao 2012-11-29 下午04:45:26
	 * @param time
	 * @param dateFormat
	 * @return
	 * @throws ParseException
	 */
	public static String getTimeStr(Date startDate, SimpleDateFormat dateFormat) throws ParseException {
		String timeStr = dateAddHours(startDate, GMT_TIME, dateFormat);
		String[] startTime = timeStr.split(" ");
		String startTimeStr = startTime[0] + "T" + startTime[1] + "Z";
		return startTimeStr;
	}		
	
	/**
	 * 时间小时数增加或减少
	 * @author Xie Qiao 2012-8-10 下午04:22:17
	 * @param time
	 * @param hours
	 * @param dateFormat
	 * @return
	 */
	public static String dateAddHours(Date time, int hours, SimpleDateFormat dateFormat) {
		long timeLong = time.getTime() / 1000 + 60l * 60 * hours;
		time.setTime(timeLong * 1000);
		String timeStr = dateFormat.format(time);
		return timeStr;
	}
	
	/**
	 * 时间天数增加或减少
	 * @author Xie Qiao 2012-8-10 下午04:22:17
	 * @param time
	 * @param hours
	 * @param dateFormat
	 * @return
	 */
	public static String dateAddDays(Date time, int days, String dateFormat) {
		SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
		long timeLong = time.getTime() / 1000 + 60l * 60 * 24 * days;
		time.setTime(timeLong * 1000);
		String timeStr = sdf.format(time);
		return timeStr;
	}
	
	/**
	 * 时间天数增加或减少
	 * @author Xie Qiao 2012-8-10 下午04:22:17
	 * @param time
	 * @param hours
	 * @param dateFormat
	 * @return
	 */
	public static String dateAddDays(Date time, int days, SimpleDateFormat dateFormat) {
		long timeLong = time.getTime() / 1000 + 60l * 60 * 24 * days;
		time.setTime(timeLong * 1000);
		String timeStr = dateFormat.format(time);
		return timeStr;
	}	
	
	/**
	 * 时间月份加减
	 * @author Xie Qiao 2015-2-3 下午02:37:42
	 * @param date
	 * @return
	 * @throws ParseException
	 */
	public static String subMonth(String date, SimpleDateFormat sdf, int month) throws ParseException {  
        Date dt = sdf.parse(date);  
        Calendar rightNow = Calendar.getInstance();  
        rightNow.setTime(dt);  
        rightNow.add(Calendar.MONTH, month);  
        Date dt1 = rightNow.getTime();  
        String reStr = sdf.format(dt1);  
  
        return reStr;  
    }  	
	
	
	public static String getStartDate(String start, String init, String keep, SimpleDateFormat dateFormat)
	        throws ParseException {
		String startDate = start;
		Date startDay = dateFormat.parse(start);
		Date judgeDay = dateCompare(init, keep, dateFormat);
		if (startDay.before(judgeDay)) {
			startDate = dateFormat.format(judgeDay);
		}
		return startDate;
	}
	
	/**
	 * 比较时间，并返回最大时间
	 * @author Xie Qiao 2013-7-11 下午04:56:25
	 * @return
	 * @throws ParseException
	 */
	public static Date dateCompare(String initDateStr, String keepDateStr, SimpleDateFormat sdf) throws ParseException {
		Date initDate = sdf.parse(initDateStr);
		Date keepDate = sdf.parse(keepDateStr);
		if (initDate.after(keepDate)) {
			return initDate;
		} else {
			return keepDate;
		}
	}	
	
	/**
	 * 判断开始时间是否大于结束时间
	 * @author Xie Qiao 2013-7-15 下午02:48:41
	 * @param start
	 * @param end
	 * @param dateFormat
	 * @return
	 * @throws ParseException
	 */
	public static boolean dateCheck(String start, String end, SimpleDateFormat dateFormat) throws ParseException {
		boolean flag = true;
		Date startDate = dateFormat.parse(start);
		Date endDate = dateFormat.parse(end);
		if (startDate.after(endDate)) {
			flag = false;
		}
		return flag;
	}	
}
