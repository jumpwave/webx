package org.flhy.dataAudit.util;
/**
 * @ProjectName: Antelope系统开发框架
 * @Copyright: 2012 ChongQing Hikvision System Technology Co., Ltd. All Right Reserved.
 * @address: http://www.hikvision.com
 * @date: 2012-4-24 上午09:18:40
 * @Description: 本内容仅限于重庆海康威视系统技术有限公司内部使用，禁止转发.
 */

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>
 * 属性文件工具类
 * </p>
 * @author Yang Guanlin 2012-4-24 上午09:18:40
 * @version V1.0
 * @modificationHistory=========================逻辑或功能性重大变更记录
 * @modify by user: {修改人} 2012-4-24
 * @modify by reason:{方法名}:{原因}
 */
public final class PropertiesUtil {
	
	private static final Logger LOG = LoggerFactory.getLogger(PropertiesUtil.class);
	/**
	 * 读取配置文件
	 * @return
	 * @throws IOException 
	 */
	public static Properties getPropertiesByFilePath(String file) throws IOException {
		Properties pro = null;
		// 从文件mdxbu.properties中读取网元ID和模块ID信息
		FileInputStream in = null;
		try {
			in = new FileInputStream(new File(file));
			pro = new Properties();
			pro.load(in);
		} finally {
			try {
				if (in != null) {
					in.close();
				}
			} catch (IOException e) {
				LOG.warn("Read " + file + " IOException:", e);
			}
		}
		return pro;
	}
	/**
	 * 读取配置文件
	 * @return
	 * @throws IOException 
	 */
	public static Properties getPropertiesByClassPath(String file) throws IOException {
		Properties pro = null;
		// 从文件mdxbu.properties中读取网元ID和模块ID信息
		InputStream in = null;
		try {
			in = PropertiesUtil.class.getClassLoader().getResourceAsStream(file);
			pro = new Properties();
			pro.load(in);
		} finally {
			try {
				if (in != null) {
					in.close();
				}
			} catch (IOException e) {
				LOG.warn("Read " + file + " IOException:", e);
			}
		}
		return pro;
	}	
	/**
	 * 修改属性文件
	 * @param key
	 * @param value
	 * @throws IOException 
	 */
	public static void updatePro(String[] keys, String[] values, String filePath) throws IOException {
		// key为空则返回
		if (keys == null || keys.length == 0) {
			return;
		}
		Properties pro = getPropertiesByFilePath(filePath);
		if (pro == null) {
			pro = new Properties();
		}
		int length = keys.length;
		for (int i = 0; i < length; i++) {
			String value = values[i];
			if (null == value) {
				value = "";
			}
			pro.put(keys[i], value);
		}
		savePropertiesToFile(pro, filePath);
		// 保存属性到文件中
	}
//	/**
//	 * 增加属性文件值
//	 * @param key
//	 * @param value
//	 */
//	public static void addProperties(String keys[], String values[], String file) {
//		Properties properties = getProperties(file);
//		FileOutputStream oFile = null;
//		try {
//			int length = keys.length;
//			for (int i = 0; i < length; i++) {
//				properties.put(keys[i], values[i]);
//			}
//			oFile = new FileOutputStream(file, true);
//			properties.store(oFile, "modify properties file");
//		} catch (FileNotFoundException e) {
//			LOG.warn("do " + file + " FileNotFoundException:", e);
//		} catch (IOException e) {
//			LOG.warn("do " + file + " IOException:", e);
//		} finally {
//			try {
//				if (oFile != null) {
//					oFile.close();
//				}
//			} catch (IOException e) {
//				LOG.warn("do " + file + " IOException:", e);
//			}
//		}
//	}
	
	/**
	 * 修改属性文件
	 * @param key
	 * @param value
	 */
	@Deprecated
	public static void updateProperties(String[] keys, String[] values, String filePath) {
		// key为空则返回
		try {
	        updatePro(keys, values, filePath);
        } catch (IOException e) {
	        // TODO Auto-generated catch block
	        e.printStackTrace();
        }
		// 保存属性到文件中
	}
	

	@Deprecated
	public static Properties getProperties(String file) {
		try {
			return getPropertiesByFilePath(file);
		} catch (Exception e) {
			LOG.warn("Read " + file + " IOException:", e);
		}
		return null;
	}
	/**
	 * 保存属性到文件中
	 * @param pro
	 * @param file
	 */
	@Deprecated
	public static void saveProperties(Properties pro, String filePath) {
		try {
			savePropertiesToFile(pro, filePath);
		} catch (Exception e) {
			LOG.error("保存属性文件异常:", e);
		}
	}
	/**
	 * 
	 * @author Yang Guanlin 2014-7-1 下午02:51:56
	 * @param pro
	 * @param file
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
	public static void savePropertiesToFile(Properties pro, String filePath) throws FileNotFoundException, IOException {
		if (pro == null) {
			return;
		}
		FileOutputStream oFile = null;
		try {
			oFile = new FileOutputStream(filePath, false);
			pro.store(oFile, "modify properties file");
		} finally {
			try {
				if (oFile != null) {
					oFile.close();
				}
			} catch (IOException e) {
				LOG.warn("close " + filePath + " IOException:", e);
			}
		}
	}
}
