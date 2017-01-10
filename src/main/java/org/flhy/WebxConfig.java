package org.flhy;

import javax.sql.DataSource;

import org.apache.commons.dbcp.BasicDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.mapper.MapperScannerConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;

@Configuration
@PropertySource("classpath:config.properties")
@ComponentScan(basePackages={"org.flhy.dataAudit"})
@ImportResource("classpath:spring.xml")
@Import(MvcConfig.class)
public class WebxConfig {

	@Bean(destroyMethod="close")
	public DataSource metadataDataSource(Environment environment){
		BasicDataSource dataSource = new BasicDataSource();
		dataSource.setDriverClassName(environment.getProperty("db.driverClassName"));
		dataSource.setUrl(environment.getProperty("db.url"));
		dataSource.setUsername(environment.getProperty("db.username"));
		dataSource.setPassword(environment.getProperty("db.password"));
		return dataSource;

	}
	
	@Bean
	public SqlSessionFactoryBean sqlSessionFactory(DataSource metadataDataSource){
		SqlSessionFactoryBean sqlSessionFactory = new SqlSessionFactoryBean();
		sqlSessionFactory.setDataSource(metadataDataSource);
		sqlSessionFactory.setConfigLocation(new ClassPathResource("mybatis-config.xml"));
		return sqlSessionFactory;
	}
	
	@Bean
	public MapperScannerConfigurer mapperScannerConfigurer(SqlSessionFactory sqlSessionFactory){
		MapperScannerConfigurer mapperScannerConfigurer = new MapperScannerConfigurer();
		mapperScannerConfigurer.setAnnotationClass(Repository.class);
		mapperScannerConfigurer.setSqlSessionFactory(sqlSessionFactory);
		mapperScannerConfigurer.setBasePackage("org.flhy.metadata.dao,org.flhy.web.service.trans.dao,org.flhy.dataAudit.dao");
		return mapperScannerConfigurer;
	}
	
}
