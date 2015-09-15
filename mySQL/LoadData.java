package mySQLLoad;

import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

public class LoadData{

	public void readFromFile() {

		String txtFile = "Project2Data.txt"; //The original input file

		Map<String,String> categoryMap = new HashMap<String,String>(); //Hashmap for storing categories

	    try {
	        FileReader in = new FileReader(txtFile);
	        BufferedReader br = new BufferedReader(in);

	        String line = br.readLine(); //Every line of input file

	        String finalBookLine = ""; //set of values for book_table
        	String bookId = ""; //The book id 

	        while (line != null) {

	            line = br.readLine();
	            line = line.trim(); //Read every line and trim it

	            if(line!=null) {
	            	if(line.equals("")) {
	            		//Space is there here, So moving on to next book - Set bookid to null
	            		bookId = "";
	            	}
		            if(line.contains(":")) {
		            	//Information about book, tokenize and send to books_table

		            	String firstPart = line.substring(0, line.indexOf(":"));
						String secondPart = line.substring(line.indexOf(":")+1);
						secondPart = secondPart.trim();
						finalBookLine = finalBookLine+secondPart+"\t";

						StringTokenizer first = new StringTokenizer(finalBookLine,"\t");
	            		bookId = first.nextElement().toString(); //Extracting the book ID alone

		            } else {
		            	if(line.contains("|")) {
		            		//Information about categories

		            		if(!bookId.equals("")) {
		            			//Checking if book id is null or not

			            		StringTokenizer st = new StringTokenizer(line, "|");
								while (st.hasMoreElements()) {
									//Categories are separated by pipe symbol

									String category = st.nextElement().toString();
									category = category.trim();
									//category represents a single category 

									if(!category.equals("")) {
										//When category is not null

										int openBraces = category.indexOf("[");
										int closeBraces = category.indexOf("]");

										String categoryName = category.substring(0,openBraces);
										//Category name is the one until the open braces
										String categoryId = category.substring(openBraces+1,closeBraces);
										//CategoryID is the one after open bracs and until close
										if(!bookId.equals("")) {
											writeBookCategoryMapping(bookId,categoryId); //Write into separate file
										}
										categoryMap.put(categoryId,categoryName); //Unique storing of category id and name in hashmap
									
									} //Check category not null
								} //check if tokenizer has more elements
		            		} // check bookid not null
		            	} // check if pipe symbol is present

		            	finalBookLine = finalBookLine.trim();
		            	if(finalBookLine.length()>1) {
		            		//Write the collected book details into the file
		            		tokenizeAndWriteBooks(finalBookLine);
		           			finalBookLine = ""; //Prepare for next line of input
		            	}// check finalBookLine.length() 
	            	}     
	        	} //while line ! null
	    	} //try
        in.close();
	    } catch (Exception e) {
	        System.err.println("Error: "+e.getMessage());
	        e.printStackTrace();
	    }

	    //Write details in map into a file
	    Iterator it = categoryMap.entrySet().iterator();
	    while (it.hasNext()) {
	        Map.Entry pair = (Map.Entry)it.next();
	        writeCategory(pair.getKey().toString(),pair.getValue().toString());
	        it.remove(); // avoids a ConcurrentModificationException
	    }
	}

	/**
	* To write book and category file
	*/
	public void writeBookCategoryMapping(String book,String category) {
		try {
			String lineSeparator = System.getProperty("line.separator");
			File file = new File("product_category_table.txt");
			if (!file.exists()) {
				file.createNewFile();
			}

			FileWriter fw = new FileWriter(file.getAbsoluteFile(),true); //to append - true
			BufferedWriter bw = new BufferedWriter(fw);
			bw.write(book+"\t"+category);
			bw.write(lineSeparator);
			bw.close();
		} catch(Exception e) {
        	System.err.println("Error: " );
        	e.printStackTrace();
		}
	}

	/**
	* To write category file
	*/
	public void writeCategory(String categoryID,String categoryName) {
		try {
			String lineSeparator = System.getProperty("line.separator");
			File file = new File("category_table.txt");
			if (!file.exists()) {
				file.createNewFile();
			}

			FileWriter fw = new FileWriter(file.getAbsoluteFile(),true); //to append - true
			BufferedWriter bw = new BufferedWriter(fw);
			bw.write(categoryID+"\t"+categoryName);
			bw.write(lineSeparator);
			bw.close();
		} catch(Exception e) {
        	System.err.println("Error: " );
        	e.printStackTrace();
		}
	}

	/**
	* To write book file
	*/
	public void tokenizeAndWriteBooks(String line) {
		try {
			String lineSeparator = System.getProperty("line.separator");
			File file = new File("products_table.txt");
			if (!file.exists()) {
				file.createNewFile();
			}

			FileWriter fw = new FileWriter(file.getAbsoluteFile(),true); //to append - true
			BufferedWriter bw = new BufferedWriter(fw);
			bw.write(line);
			bw.write(lineSeparator);
			bw.close();
		} catch (Exception e) {
        	System.err.println("Error: " );
        	e.printStackTrace();
   		}
	}

	public static void main(String args[]) {
		LoadData loadData = new LoadData();
		loadData.readFromFile();
	}
}