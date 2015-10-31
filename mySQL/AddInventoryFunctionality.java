package mySQL;
import java.sql.*;

public class AddInventoryFunctionality {

	static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";  
    static final String DB_URL = "jdbc:mysql://localhost/ecommercedb";

    //  Database credentials
    static final String USER = "root";
    static final String PASS = "root";

	public void addInventory() {

		int totalProducts = 548551;
	    Connection conn = null;
	    Statement stmt = null;
	    try{
	      //STEP 2: Register JDBC driver
	      Class.forName("com.mysql.jdbc.Driver");

	      //STEP 3: Open a connection
	      
	      conn = DriverManager.getConnection(DB_URL, USER, PASS);
	      
	      stmt = conn.createStatement();

	      //STEP 4: Execute a query
	      for(int i=0;i<totalProducts;i++) {
	      
			    String sql = "INSERT INTO product_inventory_table " +
			                   "VALUES ("+(i+1)+", 5)";
			    stmt.executeUpdate(sql);
	      }
	      
	      System.out.println("Inserted.");

	   }catch(SQLException se){
	      //Handle errors for JDBC
	      se.printStackTrace();
	   }catch(Exception e){
	      //Handle errors for Class.forName
	      e.printStackTrace();
	   }finally{
	      //finally block used to close resources
	      try{
	         if(stmt!=null)
	            conn.close();
	      }catch(SQLException se){
	      }// do nothing
	      try{
	         if(conn!=null)
	            conn.close();
	      }catch(SQLException se){
	         se.printStackTrace();
	      }//end finally try
	   }//end try
	}

	public static void main(String args[]) {
		AddInventoryFunctionality addInventory = new AddInventoryFunctionality();
		addInventory.addInventory();
	}
}