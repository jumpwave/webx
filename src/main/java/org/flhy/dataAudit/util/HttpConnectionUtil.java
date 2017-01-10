package org.flhy.dataAudit.util;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.CoreConnectionPNames;
import org.apache.http.util.EntityUtils;

public class HttpConnectionUtil {
	public static String httpClientPost(String urlPath,Map<String,String> map){
		String result = null;
		try {
			HttpPost post = new HttpPost(urlPath);
			List<NameValuePair> formparams = new ArrayList<NameValuePair>();
			for(String s : map.keySet()){
				formparams.add(new BasicNameValuePair(s, map.get(s)));
			}
			UrlEncodedFormEntity entity = new UrlEncodedFormEntity(formparams, "UTF-8");
			post.setEntity(entity);
			HttpClient client = new DefaultHttpClient();
			client.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT,3000);//连接时间
			client.getParams().setParameter(CoreConnectionPNames.SO_TIMEOUT,5000);//数据传输时间
			HttpResponse response = client.execute(post);
			result = EntityUtils.toString(response.getEntity());
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return result;
	}
	
	public static String doRequest(String urlPath,String content,String contentType){
		String result = null;
		DataOutputStream dos = null;
		InputStream is = null;
		try {
			URL url = new URL(urlPath);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			// 设置每次传输的流大小，
			// 此方法用于在预先不知道内容长度时启用没有进行内部缓冲的 HTTP 请求正文的流。
			//conn.setChunkedStreamingMode(1024 * 16);// 16K
			// 设置参数
			conn.setDoInput(true);
			conn.setDoOutput(true);
			conn.setUseCaches(false);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("accept-encoding", "gzip,deflate");
			conn.setRequestProperty("Connection", "Keep-Alive");
			conn.setRequestProperty("Charset", "UTF-8");
			conn.setRequestProperty("Content-Type", contentType);
			dos = new DataOutputStream(conn.getOutputStream());
			dos.write(content.getBytes("UTF-8"));
			dos.flush();
			is = conn.getInputStream();
			result = IOUtils.toString(is, "utf-8");
			conn.disconnect();
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			try {
				if(is != null){
					is.close();
				}
				if(dos != null){
					dos.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		return result;
	}
	
	public static String doRequest(String urlPath,InputStream dataIns,String contentType){
		String result = null;
		OutputStream dos = null;
		InputStream is = null;
		try {
			URL url = new URL(urlPath);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			// 设置每次传输的流大小，
			// 此方法用于在预先不知道内容长度时启用没有进行内部缓冲的 HTTP 请求正文的流。
			conn.setChunkedStreamingMode(1024 * 16);// 16K
			// 设置参数
			conn.setDoInput(true);
			conn.setDoOutput(true);
			conn.setUseCaches(false);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("accept-encoding", "gzip,deflate");
			conn.setRequestProperty("Connection", "Keep-Alive");
			conn.setRequestProperty("Charset", "UTF-8");
			conn.setRequestProperty("Content-Type", contentType);
			dos = conn.getOutputStream();
			IOUtils.copy(dataIns, dos);
			dos.flush();
			is = conn.getInputStream();
			result = IOUtils.toString(is, "utf-8");
			conn.disconnect();
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			try {
				if(is != null){
					is.close();
				}
				if(dos != null){
					dos.close();
				}
				if(dataIns != null){
					dataIns.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		return result;
	}
	
	public static void main(String[] args) throws Exception {
		//String s = HttpConnectionUtil.doRequest("http://10.100.60.16:8089/StartConvert", "{\"KmsToken\":\"0d65c57effffffff4c34a16891f84e7b\",\"CloudIP\":\"10.196.136.39\",\"FileId\":\"/cloud/5c3f6fcd49941b6c304ebe6c76effc4a\"}", "application/json");
		String s = HttpConnectionUtil.doRequest("http://10.100.60.24:8080/servlet/AdapterHTTP?ACTION_NAME=LOAD_DOCUMENT_ACTION&ACTION_MODEL=list","", "application/json");
		System.out.println(s);
	}
	
	
}
