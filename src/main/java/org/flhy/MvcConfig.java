package org.flhy;

import javax.sql.DataSource;

import org.apache.commons.dbcp.BasicDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.mapper.MapperScannerConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.stereotype.Repository;

@Configuration
@PropertySource("classpath:config.properties")
@ImportResource("classpath:spring-mvc.xml")
@ComponentScan(basePackages={"org.flhy.log","org.flhy.exception","org.flhy.dataAudit"})
@EnableAspectJAutoProxy
public class MvcConfig {
	
	@Bean(name="metadataDataSource", destroyMethod="close")
	@Profile("dev")
	public DataSource h2DataSource(Environment environment){
		System.out.println("h2DataSource");
//		return new EmbeddedDatabaseBuilder().setType(EmbeddedDatabaseType.H2).addScript("").build();
		BasicDataSource dataSource = new BasicDataSource();
		dataSource.setDriverClassName(environment.getProperty("db.driverClassName"));
		dataSource.setUrl(environment.getProperty("db.url"));
		dataSource.setUsername(environment.getProperty("db.username"));
		dataSource.setPassword(environment.getProperty("db.password"));
		return dataSource;
	}	
	
	@Bean(destroyMethod="close")
	@Profile("prod")
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
