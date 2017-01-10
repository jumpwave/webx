/**
 * @ProjectName: CMS基线平台软件
 * @Copyright: 2010 HangZhou Hikvision System Technology Co., Ltd. All Right Reserved.
 * @address: http://www.hikvision.com
 * @date: 2014-5-30 下午05:44:36
 * @Description: 本内容仅限于杭州海康威视数字技术系统公司内部使用，禁止转发.
 */
package org.flhy.dataAudit.util;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.sql.Blob;
import java.text.DecimalFormat;
import java.util.Collection;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

/**
 * 提供判空,数字,字符验证转换,Json,xml字符转换
 * @author jiangbocqxt
 *
 */
public abstract class ObjectUtil {
	
	public final static DecimalFormat formatPercent = new DecimalFormat("####.00");
	

	public static boolean isNullOrEmpty(String str) {
		return (str == null || str.trim().length() < 1);
	}
	
	public static boolean isEmpty(String str) {
		return (str == null || str.trim().length() < 1);
	}
	

	public static boolean isNotNullOrEmpty(String str) {
		if (str != null && !str.equals("")) {
			return true;
		} else {
			return false;
		}

	}
	
	public static boolean isNotEmpty(String str) {
		if (!str.equals("")) {
			return true;
		} else {
			return false;
		}
	}
	

	public static boolean isEmpty(Object[] array) {
		return (array == null || array.length == 0);
	}
	
	/**
	 * 判断是否为空 1：空/0：非空
	 * @author Liu Banggen 2012-4-10 下午12:25:24
	 * @param coll
	 * @return
	 */
	public static boolean isEmpty(Collection<?> coll) {
		return coll == null ? true : coll.isEmpty();
	}
	
	/**
	 * 判断是否为空 1：空/0：非空
	 * @author Liu Banggen 2012-4-10 下午12:43:14
	 * @param map
	 * @return
	 */
	public static boolean isEmpty(Map<?, ?> map) {
		return map == null ? true : map.isEmpty();
	}
		
	
	/**
	 * 
	 * @Author : yuhaihua
	 * @Date : 2010-5-12 上午11:06:55
	 * @Description : 如果传入参数为一位数字. 则前面加上0,若不是, 则直接转化为String类型返回
	 * @param str 字符串对象
	 * @return
	 * @ModificationHistory ===================================
	 * @Modify by :modify_name
	 * @Date :2010-5-12上午11:06:55
	 * @Modify reason :
	 * 
	 */
	public static String toParamString(Integer pamara) {
		String result;
		if (pamara.toString().length() == 1) {
			result = "0" + pamara;
		} else {
			result = pamara.toString();
		}
		return result;
	}
	
	/**
	 * @Author: zhanhongkui
	 * @Date: 2010-7-7
	 * @Description: 判断字符串是否在数组中
	 * @param String str
	 * @param []String arr[]
	 * @ModificationHistory ===================================
	 * @Modify by:
	 * @Date:
	 * @Modify reason :
	 */
	public static boolean isStrIn(String str, String... compareArr) {
		// 判断待比较参数是否为空
		if (str == null || str.trim().length() < 1)
			return false;
		
		// 判断比较数组是否为空
		if (compareArr == null || compareArr.length < 1)
			return false;
		
		// 判断数组中是否存在对应的字符串
		for (String temp : compareArr) {
			// 数组元素为空则中止本次循环
			if (temp == null)
				continue;
			
			// 如果匹配到数组元素，则返回
			if (temp.equals(str))
				return true;
		}
		
		// 如果与数组中所有元素都不匹配，则返回false
		return false;
	}
	
	/*
	 * 特殊字符转换
	 */
	public static String escapeToString(String name) {
		name = name.replaceAll("_", "\\\\_");
		return name;
	}
	
	/**
	 * 将blob类型转为byte[]类型
	 * @author yuhaihua 2011-11-17 下午02:04:28
	 * @param blob
	 * @return
	 */
	public static byte[] blobToBytes(Blob blob) {
		BufferedInputStream is = null;
		try {
			is = new BufferedInputStream(blob.getBinaryStream());
			byte[] bytes = new byte[(int)blob.length()];
			int len = bytes.length;
			int offset = 0;
			int read = 0;
			while (offset < len && (read = is.read(bytes, offset, len - offset)) >= 0) {
				offset += read;
			}
			return bytes;
		} catch (Exception e) {
			return null;
		} finally {
			try {
				if (is != null) {
					is.close();
					is = null;
				}
			} catch (Exception e) {
				return null;
			}
		}
	}
	
	/**
	 * 检查名称是否含有非法字符
	 * @author yuhaihua 2011-11-23 下午03:32:52
	 * @param name
	 * @return
	 */
	public static boolean checkName(String name) {
		boolean b = true;
		Pattern p = Pattern.compile("\\/:*?\"<|'%>");
		Matcher m = p.matcher(name);
		if (m.find())
			b = false;
		return b;
	}
	
	/**
	 * 检查IP地址是否合法
	 * @author yuhaihua 2011-11-23 下午03:52:43
	 * @param ipAddr
	 * @return
	 */
	public static boolean checkIp(String ipAddr) {
		Pattern pattern = Pattern
		        .compile("\\b((?!\\d\\d\\d)\\d+|1\\d\\d|2[0-4]\\d|25[0-5])\\.((?!\\d\\d\\d)\\d+|1\\d\\d|2[0-4]\\d|25[0-5])\\.((?!\\d\\d\\d)\\d+|1\\d\\d|2[0-4]\\d|25[0-5])\\.((?!\\d\\d\\d)\\d+|1\\d\\d|2[0-4]\\d|25[0-5])\\b");
		Matcher matcher = pattern.matcher(ipAddr);
		return matcher.matches();
	}
	
	/**
	 * 检查端口是否为数字
	 * @author yuhaihua 2011-11-23 下午04:09:56
	 * @param port
	 * @return
	 */
	public static boolean isNumeric(String port) {
		Pattern pattern = Pattern.compile("[0-9]*");
		Matcher matcher = pattern.matcher(port);
		return matcher.matches();
	}
	
	/**
	 * 验证用户名是否合法：由数字、26个英文字母或下划线组成
	 * @author yuhaihua 2011-11-23 下午04:21:09
	 * @param userName
	 * @return
	 */
	public static boolean isValidUserName(String userName) {
		Pattern pattern = Pattern.compile("^[0-9a-zA-Z_]{1,}$");
		Matcher matcher = pattern.matcher(userName);
		return matcher.matches();
	}
	
	/**
	 * 是否为正数
	 * @author xiongmin 2012-10-25 上午09:45:05
	 * @param numberStr 待校验的内容
	 * @return
	 */
	public static boolean isPositive(String numberStr) {
		boolean positiveIntegerFlag = isPositiveInteger(numberStr);
		boolean positiveDecimalFlag = isPositiveDecimal(numberStr);
		if (positiveIntegerFlag || positiveDecimalFlag) {
			return true;
		}
		return false;
	}
	
	/**
	 * 是否为正整数
	 * @author xiongmin 2012-10-25 上午09:46:38
	 * @param numberStr 待校验的内容
	 * @return
	 */
	public static boolean isPositiveInteger(String numberStr) {
		Pattern pattern = Pattern.compile("^[0-9]*[1-9][0-9]*$");
		Matcher matcher = pattern.matcher(numberStr);
		return matcher.matches();
	}
	
	/**
	 * 是否为正浮点数
	 * @author xiongmin 2012-10-25 上午09:46:58
	 * @param numberStr 待校验的内容
	 * @return
	 */
	public static boolean isPositiveDecimal(String numberStr) {
		Pattern pattern = Pattern.compile("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$");
		Matcher matcher = pattern.matcher(numberStr);
		return matcher.matches();
	}
	
	/**
	 * 根据长度和传入的参数将参数中不足长度的部分补0
	 * @author hansong 2012-3-29 下午01:39:03
	 * @param crossNo
	 * @param number
	 * @return
	 */
	public static String completeParamByZero(String param, int number) {
		if (param.length() >= number)
			return param;
		String crossingNo = null;
		for (int i = 0; i < number - param.length(); i++) {
			if (crossingNo == null)
				crossingNo = "0" + param;
			else
				crossingNo = "0" + crossingNo;
		}
		return crossingNo;
	}
	
	/**
	 * obj对象转换string
	 * @author caoyi 2011-4-1 下午08:42:26
	 * @param str
	 * @return
	 */
	public static String objToString(Object str) {
		return str == null ? "" : String.valueOf(str).trim();
	}
	
	/**
	 * obj对象转换Integer
	 * @author caoyi 2011-4-1 下午08:42:42
	 * @param str
	 * @return
	 */
	public static Integer objToInteger(Object str) {
		try {
			return str == null ? 0 : Integer.parseInt(String.valueOf(str).trim());
		} catch (Exception e) {
			return 0;
		}
	}
	
	/**
	 * obj对象转换Integer（带默认返回值）
	 * @author caoyi 2012-8-15 下午02:25:30
	 * @param str
	 * @param defaultResult 默认返回值
	 * @return
	 */
	public static Integer objToInteger(Object str, Integer defaultResult) {
		try {
			return str == null ? defaultResult : Integer.valueOf(str.toString().trim());
		} catch (Exception e) {
			return defaultResult;
		}
	}
	
	/**
	 * obj对象转换Double（带默认返回值）
	 * @author caoyi 2012-8-15 下午02:25:30
	 * @param str
	 * @param defaultResult 默认返回值
	 * @return
	 */
	public static Double objToDouble(Object str, Double defaultResult) {
		try {
			return str == null ? defaultResult : Double.valueOf(str.toString().trim());
		} catch (Exception e) {
			return defaultResult;
		}
	}
	
	/**
	 * obj对象转换long
	 * @author xiongmin 2012-10-18 下午07:20:58
	 * @param obj
	 * @param defaultResult 默认返回值
	 * @return
	 */
	public static long objToLong(Object obj, Integer defaultResult) {
		try {
			return obj == null ? defaultResult : Long.parseLong((obj.toString().trim()));
		} catch (Exception e) {
			return defaultResult;
		}
	}
	
	/**
	 * obj对象转换Integer
	 * @author zhangjiaqi 2011-5-3 下午04:45:02
	 * @param obj
	 * @return
	 */
	public static Integer objToIntegerWithNullValue(Object obj) {
		return obj == null ? null : Integer.valueOf(obj.toString().trim());
	}
	


	
	public static <T> T xmlToObj(Class<T> clazz, String xml) throws Exception {
		JAXBContext context = JAXBContext.newInstance(clazz);
		Unmarshaller unmarshaller = context.createUnmarshaller();
		T obj = (T)unmarshaller.unmarshal(new StringReader(xml));
		return obj;
	}
	
	public static String objectWriteToXml(Object obj) {
		StringWriter writer = new StringWriter();
		try {
			JAXBContext context = JAXBContext.newInstance(obj.getClass());
			Marshaller marshaller = context.createMarshaller();
			marshaller.marshal(obj, writer);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				writer.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return writer.toString();
	}
	

}
