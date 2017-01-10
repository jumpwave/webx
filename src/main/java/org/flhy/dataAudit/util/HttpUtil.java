/**
 * @ProjectName: Antelope系统开发框架
 * @Copyright: 2010 ChongQing Hikvision System Technology Co., Ltd. All Right Reserved.
 * @address: http://www.hikvision.com
 * @date: 2012-3-27 上午09:39:20
 * @Description: 本内容仅限于重庆海康威视系统技术有限公司内部使用，禁止转发.
 */
package org.flhy.dataAudit.util;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * @author Yang Guanlin 2013-4-10 下午07:51:49
 * @version V1.0
 * @modificationHistory=========================逻辑或功能性重大变更记录
 * @modify by user: {修改人} 2013-4-10
 * @modify by reason:{方法名}:{原因}
 */
public class HttpUtil {
	
	public static final String CHARSET = "UTF-8";
	
	private static final CloseableHttpClient httpClient;
	private static HttpUtil httpTool;
	public static final int CONN_TIMEOUT = 5000;
	
	private static final Logger LOG = LoggerFactory.getLogger(HttpUtil.class);
	
	static {
		RequestConfig config = RequestConfig.custom().setConnectTimeout(60000).setSocketTimeout(15000).build();
		httpClient = HttpClientBuilder.create().setDefaultRequestConfig(config).build();
	}
	
	public static synchronized HttpUtil getTool() {
		if (httpTool == null) {
			httpTool = new HttpUtil();
		}
		return httpTool;
	}
	
	/**
	 * HTTP连接
	 * @author Yang Guanlin 2013-4-10 下午07:49:49
	 * @return
	 */
	public static String getConnectInfo(String urlPath, String method) throws Exception {
		return request(urlPath, method, "UTF-8");
	}
	
	public static String getConnectInfo(String urlPath, String method, String charset) throws Exception {
		return request(urlPath, method, charset);
	}
	
	private static String request(String urlPath, String method, String charset) {
		BufferedReader in = null;
		HttpURLConnection conn = null;
		try {
			URL url = new URL(urlPath);
			conn = (HttpURLConnection)url.openConnection();
			if (StringUtils.isBlank(method)) {
				method = "GET";
			}
			conn.setRequestMethod(method);
			conn.setDoInput(true);
			conn.setDoOutput(true);
			conn.setReadTimeout(CONN_TIMEOUT);
			conn.setConnectTimeout(CONN_TIMEOUT);
			conn.setRequestProperty("Charset", charset);
			conn.setRequestProperty("Accept-Charset", charset);
			conn.setRequestProperty("contentType", charset);
			conn.setRequestProperty("Content-Type", charset);
			// 分别得到整数 200 和 401 。 如果无法识别响应(例如,该响应不是有效的 HTTP)，则返回 -1。
			if (200 == conn.getResponseCode()) {
				in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
				String inputLine;
				StringBuffer str = new StringBuffer();
				while ((inputLine = in.readLine()) != null) {
					str.append(inputLine);
				}
				return str.toString();
			}
		} catch (Exception e) {
			LOG.debug("http请求出现异常", e);
			
		} finally {
			if (conn != null) {
				try {
					conn.disconnect();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return null;
	};
	
	/**
	 * 指定URL获取流
	 * @author Yang Guanlin 2013-6-17 上午08:12:01
	 * @param urlPath
	 * @param method
	 * @return
	 * @throws Exception
	 */
	public static InputStream getInputStream(String urlPath, String method) throws Exception {
		BufferedReader in = null;
		try {
			URL url = new URL(urlPath);
			HttpURLConnection conn = (HttpURLConnection)url.openConnection();
			if (StringUtils.isBlank(method)) {
				method = "GET";
			}
			conn.setRequestMethod(method);
			conn.setDoInput(true);
			conn.setDoOutput(true);
			conn.setConnectTimeout(CONN_TIMEOUT);
			conn.setReadTimeout(CONN_TIMEOUT);
			// 分别得到整数 200 和 401 。 如果无法识别响应(例如,该响应不是有效的 HTTP)，则返回 -1。
			if (200 == conn.getResponseCode()) {
				return conn.getInputStream();
			}
		} catch (Exception e) {
			// LOG.debug("http请求出现异常", e);
			throw new Exception( "http请求出现异常");
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return null;
	};
	
	/**
	 * 判断是否能够连接
	 * @author Yang Guanlin 2013-4-23 下午07:16:44
	 * @param urlPath
	 * @return
	 * @throws Exception
	 */
	public static boolean connectAble(String urlPath) throws Exception {
		URL url = new URL(urlPath);
		HttpURLConnection conn = (HttpURLConnection)url.openConnection();
		conn.setReadTimeout(CONN_TIMEOUT);
		conn.setConnectTimeout(CONN_TIMEOUT);
		return 200 == conn.getResponseCode();
	};
	
	public String doPost(String url, Map<String, String> params, String charset) throws ClientProtocolException, IOException {
		CloseableHttpResponse response = null;
		String result = null;
		try {
			List<NameValuePair> list = new ArrayList<NameValuePair>();
			for (Map.Entry<String, String> entry : params.entrySet()) {
				list.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
			}
			
			HttpPost httpPost = new HttpPost(url);
			if (list != null && list.size() > 0) {
				httpPost.setEntity(new UrlEncodedFormEntity(list, charset));
			}
			response = httpClient.execute(httpPost);
			
			int statusCode = response.getStatusLine().getStatusCode();
			if (statusCode != 200) {
				httpPost.abort();
				throw new RuntimeException("HttpClient,error status code :" + statusCode);
			}
			HttpEntity entity = response.getEntity();
			if (entity != null) {
				result = EntityUtils.toString(entity, CHARSET);
			}
			EntityUtils.consume(entity);
			response.close();
		} finally {
			if (null != response) {
				response.close();
			}
		}
		return result;
	}
	
	public static String doPost(String urlPath, String content, String contentType) throws Exception {
		String str = "";
		DataOutputStream dos = null;
		BufferedReader br = null;
		try {
			URL url = new URL(urlPath);
			HttpURLConnection httpURLConnection = (HttpURLConnection)url.openConnection();
			// 设置每次传输的流大小，
			// 此方法用于在预先不知道内容长度时启用没有进行内部缓冲的 HTTP 请求正文的流。
			//httpURLConnection.setChunkedStreamingMode(1024 * 16);// 16K
			// 设置参数
			httpURLConnection.setDoInput(true);
			httpURLConnection.setDoOutput(true);
			httpURLConnection.setUseCaches(false);
			httpURLConnection.setRequestMethod("POST");
			httpURLConnection.setRequestProperty("accept-encoding", "gzip,deflate");
			httpURLConnection.setRequestProperty("Connection", "Keep-Alive");
			httpURLConnection.setRequestProperty("Charset", "UTF-8");
			httpURLConnection.setRequestProperty("Content-Type", contentType);
			dos = new DataOutputStream(httpURLConnection.getOutputStream());
			dos.write(content.getBytes("UTF-8"));
			dos.flush();
			br = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream(), "utf-8"));
			StringBuffer sb = new StringBuffer();
			String result = "";
			while ((result = br.readLine()) != null) {
				sb.append(result);
			}
			str = sb.toString();
			httpURLConnection.disconnect();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
			if (dos != null) {
				try {
					dos.close();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
		}
		return str;
	}
	
	public String doGet(String url, Map<String, String> params, String charset) throws ClientProtocolException, IOException {
		String result;
		CloseableHttpResponse response = null;
		try {
			HttpGet httpGet = new HttpGet(url);
			response = httpClient.execute(httpGet);
			int statusCode = response.getStatusLine().getStatusCode();
			if (statusCode != 200) {
				httpGet.abort();
				throw new RuntimeException("HttpClient,error status code :" + statusCode);
			}
			HttpEntity entity = response.getEntity();
			result = null;
			if (entity != null) {
				result = EntityUtils.toString(entity, charset);
			}
			EntityUtils.consume(entity);
		} finally {
			if (null != response) {
				response.close();
			}
		}
		return result;
	}
	
	/**
	 * 获取quest里面的流内容
	 * @author Yang Guanlin 2015-1-16 上午09:06:53
	 * @param request
	 * @return
	 */
	public static String getContent(HttpServletRequest request) {
		BufferedReader in = null;
		String content = null;
		try {
			in = new BufferedReader(new InputStreamReader(request.getInputStream(), "UTF-8"));
			String inputLine;
			StringBuffer str = new StringBuffer();
			while ((inputLine = in.readLine()) != null) {
				str.append(inputLine);
			}
			content = str.toString();
		} catch (Exception e) {
			LOG.debug("获取数据失败", e);

		} finally {
			if (null != in) {
				try {
					in.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return content;
	}
	
	/**
	 * 远程调用上传文件
	 * @author Yang Guanlin 2015-5-23 下午07:24:29
	 * @param uploadUrl
	 * @param fis
	 * @param fileName
	 * @return
	 * @throws Exception
	 */
	public static String remoteUploadFile(String uploadUrl, InputStream fis, String fileName) throws Exception {
		String result = "";
		DataOutputStream dos = null;
		InputStream is = null;
		try {
			String end = "\r\n";
			String twoHyphens = "--";
			String boundary = "******";
			URL url = new URL(uploadUrl);
			HttpURLConnection httpURLConnection = (HttpURLConnection)url.openConnection();
			// 设置每次传输的流大小，
			// 此方法用于在预先不知道内容长度时启用没有进行内部缓冲的 HTTP 请求正文的流。
			httpURLConnection.setChunkedStreamingMode(1024 * 16);// 16K
			// 设置参数
			httpURLConnection.setDoInput(true);
			httpURLConnection.setDoOutput(true);
			httpURLConnection.setUseCaches(false);
			httpURLConnection.setRequestMethod("POST");
			httpURLConnection.setRequestProperty("accept-encoding", "gzip,deflate");
			httpURLConnection.setRequestProperty("Connection", "Keep-Alive");
			httpURLConnection.setRequestProperty("Charset", "UTF-8");
			httpURLConnection.setRequestProperty("Content-Type", "multipart/form-data;boundary=" + boundary);
			dos = new DataOutputStream(httpURLConnection.getOutputStream());
			dos.writeBytes(twoHyphens + boundary + end);
			try {
				fileName = URLEncoder.encode(fileName,"UTF-8");
			} catch (Exception e) {
				LOG.info("对文件名转义异常，忽略。fileName=" + fileName);
			}
			dos.writeBytes("Content-Disposition: form-data; name=\"uploadedfile\"; filename=\"" + fileName + "\"" + end);
			dos.writeBytes(end);
			byte[] buffer = new byte[1024 * 64]; // 64k
			int len = 0;
			// 读取文件
			while ((len = fis.read(buffer)) != -1) {
				dos.write(buffer, 0, len);
			}
			dos.writeBytes(end);
			dos.writeBytes(twoHyphens + boundary + twoHyphens + end);
			dos.flush();
			is = httpURLConnection.getInputStream();
			InputStreamReader isr = new InputStreamReader(is, "utf-8");
			BufferedReader br = new BufferedReader(isr);
			result = br.readLine();
			System.out.println(result);
			httpURLConnection.disconnect();
		} finally {
			if (fis != null) {
				try {
					fis.close();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
			if (dos != null) {
				try {
					dos.close();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
			if (is != null) {
				try {
					is.close();
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
			}
		}
		return result;
	}
	
	public static String upload(String uploadUrl, String content, String contentType) throws Exception {
		String result = "";
		DataOutputStream dos = null;
		InputStream is = null;
		try {
			URL url = new URL(uploadUrl);
			HttpURLConnection httpURLConnection = (HttpURLConnection)url.openConnection();
			// 设置每次传输的流大小，
			// 此方法用于在预先不知道内容长度时启用没有进行内部缓冲的 HTTP 请求正文的流。
			httpURLConnection.setChunkedStreamingMode(1024 * 16);// 16K
			// 设置参数
			httpURLConnection.setDoInput(true);
			httpURLConnection.setDoOutput(true);
			httpURLConnection.setUseCaches(false);
			httpURLConnection.setRequestMethod("POST");
			httpURLConnection.setRequestProperty("accept-encoding", "gzip,deflate");
			httpURLConnection.setRequestProperty("Connection", "Keep-Alive");
			httpURLConnection.setRequestProperty("Charset", "UTF-8");
			httpURLConnection.setRequestProperty("Content-Type", contentType);
			byte[] buf = content.getBytes("UTF-8");
			int length = buf.length;
			// LOG.info("Content-Length={}",length);
			httpURLConnection.setRequestProperty("Content-Length", "" + length);
			dos = new DataOutputStream(httpURLConnection.getOutputStream());
			dos.write(buf);
			dos.flush();
			is = httpURLConnection.getInputStream();
			InputStreamReader isr = new InputStreamReader(is, "utf-8");
			BufferedReader br = new BufferedReader(isr);
			result = br.readLine();
			httpURLConnection.disconnect();
		} finally {
			if (dos != null) {
				try {
					dos.close();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
			if (is != null) {
				try {
					is.close();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
		}
		return result;
	}
	
//	/**
//	 * 公共请求方法
//	 * @author libangsen 2016-7-18 下午2:13:18
//	 * @param urlPath
//	 * @param obj
//	 * @param method
//	 * @return
//	 * @throws Exception
//	 */
//	public String request(String urlPath, Object obj, String method) throws Exception {
//		HttpURLConnection conn = null;
//		OutputStream out = null;
//		BufferedReader in = null;
//		String result = null;
//		try {
//			URL url = new URL(urlPath);
//			conn = (HttpURLConnection)url.openConnection();
//			if (StringUtils.isBlank(method)) {
//				method = HttpMethod.GET;
//			} else if (HttpMethod.DELETE.equals(method)) {
//				// 删除不能output
//				return doDelete(urlPath, obj);
//			}
//			
//			conn.setRequestMethod(method);
//			conn.setDoInput(true);
//			conn.setDoOutput(true);
//			conn.setReadTimeout(CONN_TIMEOUT);
//			conn.setConnectTimeout(CONN_TIMEOUT);
//			conn.setRequestProperty("Charset", CHARSET);
//			conn.setRequestProperty("Content-type", "text/html");
//			conn.setRequestProperty("Accept-Charset", CHARSET);
//			conn.setRequestProperty("contentType", CHARSET);
//			// conns.setRequestProperty("X-Auth-Token", "token"); //设置请求的token
//			// 参数
//			if (null != obj) {
//				out = conn.getOutputStream();
//				String params = new Gson().toJson(obj);
//				out.write(params.getBytes(CHARSET));
//				out.flush();
//			}
//			// 分别得到整数 200 和 401 。 如果无法识别响应(例如,该响应不是有效的 HTTP)，则返回 -1。
//			if (200 == conn.getResponseCode()) {
//				in = new BufferedReader(new InputStreamReader(conn.getInputStream(), CHARSET));
//				String inputLine;
//				StringBuffer str = new StringBuffer();
//				while ((inputLine = in.readLine()) != null) {
//					str.append(inputLine);
//				}
//				return str.toString();
//			}
//		} catch (Exception e) {
//			LOG.error("http请求出现异常", e);
//			throw e;
//		} finally {
//			if (conn != null) {
//				try {
//					conn.disconnect();
//				} catch (Exception e) {
//					e.printStackTrace();
//				}
//			}
//			if (in != null) {
//				try {
//					in.close();
//				} catch (IOException e) {
//					e.printStackTrace();
//				}
//			}
//			if (out != null) {
//				try {
//					out.close();
//				} catch (Exception e) {
//					e.printStackTrace();
//				}
//			}
//		}
//		return result;
//	}
	
	
	
	/**
	 * DELETE方法，支持将参数放入body
	 * @author libangsen 2016-8-1 下午2:40:16
	 * @param url
	 * @param obj
	 * @return
	 * @throws Exception
	 */
	private String doDelete(String url, Object obj) throws Exception {
		String result = null;
		
//		Builder builder = RequestConfig.custom();
//		builder.setConnectTimeout(CONN_TIMEOUT);
//		builder.setSocketTimeout(CONN_TIMEOUT);
//		
//		RequestConfig config = builder.build();
//		CloseableHttpClient httpClient = HttpClientBuilder.create().setDefaultRequestConfig(config).build();
//		CloseableHttpResponse response = null;
//		try {
//			MyHttpDelete httpDelete = new MyHttpDelete(url);
//			
//			BasicHttpEntity content = new BasicHttpEntity();
//			content.setContent(new BufferInputStream(new Gson().toJson(obj).getBytes(CHARSET)));
//			httpDelete.setEntity(content);
//			
//			response = httpClient.execute(httpDelete);
//			int statusCode = response.getStatusLine().getStatusCode();
//			if (statusCode != 200) {
//				httpDelete.abort();
//				throw new RuntimeException("HttpClient,error status code :" + statusCode);
//			}
//			HttpEntity entity = response.getEntity();
//			if (entity != null) {
//				result = EntityUtils.toString(entity, CHARSET);
//			}
//			EntityUtils.consume(entity);
//		} finally {
//			if (null != response) {
//				response.close();
//			}
//		}
		return result;
	}
	
	public static void main(String[] args) throws ClientProtocolException, IOException {
		String postUtl = "http://10.22.38.111:8082/domain/kms/cluesPage?orderBy=update_time";
		Map<String, String> params = new HashMap<String, String>();
		// params.put("srcApps", "VIID,OVIT,S60");
		String res = HttpUtil.getTool().doPost(postUtl, params, CHARSET);
		System.out.println(res);
	}
	
}


/**
 * 重构HttpDelete类，使之支持
 * @author libangsen 2016-8-1 下午2:37:25
 * @version V1.0   
 * @modificationHistory=========================逻辑或功能性重大变更记录
 * @modify by user: {修改人} 2016-8-1
 * @modify by reason:{方法名}:{原因}
 */
class MyHttpDelete extends HttpEntityEnclosingRequestBase {
	
	public static final String METHOD_NAME = "DELETE";
	
	public String getMethod() {
		return METHOD_NAME;
	}
	
	public MyHttpDelete(final String uri) {
		super();
		setURI(URI.create(uri));
	}
	
	public MyHttpDelete(final URI uri) {
		super();
		setURI(uri);
	}
	
	public MyHttpDelete() {
		super();
	}
	
}
