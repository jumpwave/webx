package org.flhy;

import javax.sql.DataSource;

import org.apache.commons.dbcp.BasicDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

@Configuration
@Profile("dev")
public class DevelopmentProfileConfig {
	@Bean(destroyMethod="close")
	public DataSource metadataDataSource(Environment environment){
//		BasicDataSource dataSource = new BasicDataSource();
//		dataSource.setDriverClassName(environment.getProperty("db.driverClassName"));
//		dataSource.setUrl(environment.getProperty("db.url"));
//		dataSource.setUsername(environment.getProperty("db.username"));
//		dataSource.setPassword(environment.getProperty("db.password"));
//		return dataSource;
		
		return new EmbeddedDatabaseBuilder().setType(EmbeddedDatabaseType.H2).addScript("").build();

	}
	
	
}
