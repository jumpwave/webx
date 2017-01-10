package org.flhy.test.dataAudit;

import org.flhy.MvcConfig;
import org.flhy.WebxConfig;
import org.flhy.dataAudit.service.DataAuditTaskController;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(value = SpringJUnit4ClassRunner.class)  
@ContextConfiguration(classes={MvcConfig.class,WebxConfig.class})
public class DataAuditTaskTest {
/*	@Autowired
	private AopService aopService;*/
	@Autowired
	private DataAuditTaskController dataAuditTaskController;
	@Test
	public void getDataAuditTaskTest(){
		dataAuditTaskController.findAllDataAuditTask();
	}
}
