
package org.flhy.dataAudit.bo;

public class ResultResponse {
	public static final String RET = "ret";
	public static final Integer RET_SUCCESS = 0;
	public static final Integer RET_FAIL = 1;
	
	public static final String MSG = "msg";
	public final static String MSG_SUCCESS = "操作成功";
	public final static String MSG_FAIL = "操作失败";	
	
	public Object result;
	public static ResultResponse getSuccess() {
		ResultResponse response = new ResultResponse();
		response.setRet(RET_SUCCESS);
		response.setMsg(MSG_SUCCESS);
		return response;
	}
	
	private Integer ret = RET_FAIL;
	private String msg = MSG_FAIL;
	
    public Integer getRet() {
    	return ret;
    }
	
    public void setRet(Integer ret) {
    	this.ret = ret;
    }
	
    public String getMsg() {
    	return msg;
    }
	
    public void setMsg(String msg) {
    	this.msg = msg;
    }

	public Object getResult() {
		return result;
	}

	public void setResult(Object result) {
		this.result = result;
	}
    
}
