package mySQL;

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

		String txtFile = "SQLDataFiles//amazon-meta.txt"; //The original input file

		Map<String,String> categoryMap = new HashMap<String,String>(); //Hashmap for storing categories
		Map<String,String> reviewMap = new HashMap<String,String>();//Hashmap for storing reviews
		Map<String,String> similarMap = new HashMap<String,String>(); //Hashmap for storing the similar values
		boolean isRecordCompleted = false;

	    try {
	        FileReader in = new FileReader(txtFile);
	        BufferedReader br = new BufferedReader(in);

	        String line = br.readLine(); //Every line of input file

	        String finalBookLine = ""; //set of values for book_table
        	String bookId = ""; //The book id 

	        while (line != null) {

	            line = br.readLine();
	            line = line.trim(); //Read every line and trim it

	            if(line==null || line.length() == 0 || line.equals("")){
	            	//Line space between two lines indicates end of a record
	            	isRecordCompleted = true;
	            }
	            if(line!=null) {
	            	if(line.equals("")) {
	            		//Space is there here, So moving on to next book - Set bookid to null
	            		bookId = "";
	            	}
		            if(line.contains(":")) {
		            	//Information about book, tokenize and send to books_table

		            	String firstPart = line.substring(0, line.indexOf(":"));
		            	firstPart=firstPart.trim();
		            	String secondPart = line.substring(line.indexOf(":")+1);

		            	if("Id".equals(firstPart) ||
		            	"ASIN".equals(firstPart)|| "title".equals(firstPart)
		            	||"group".equals(firstPart) ||
		            	"salesrank".equals(firstPart) ||
		            	"similar".equals(firstPart) ||
		            	"categories".equals(firstPart) ||
		            	"reviews".equals(firstPart) ) {
							//Check first part and then only add second part
		            		if(firstPart.trim().equals("similar")) {
								secondPart = parseSimilar(firstPart,secondPart,bookId);
							}
							if(firstPart.trim().equals("reviews")) {
								//secondPart="!!";
								secondPart = parseReviews(firstPart,secondPart,bookId,br);
								
							}

							secondPart = secondPart.trim();

							finalBookLine = finalBookLine+secondPart+"\t";

							StringTokenizer first = new StringTokenizer(finalBookLine,"\t");
		            		bookId = first.nextElement().toString(); //Extracting the book ID alone
		            	} else {
		            		secondPart= "";
		            	}
						
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

		            	
	            	} //else closing
	            	
	        	} //if line ! null

	    	if(isRecordCompleted) {
	        		finalBookLine = finalBookLine.trim();
	            	if(finalBookLine.length()>1) {
	            		//Write the collected book details into the file
	            		tokenizeAndWriteBooks(finalBookLine);
	           			finalBookLine = ""; //Prepare for next line of input
	            	}// check finalBookLine.length()
	            	isRecordCompleted = false;  
	        	}//if(isRecordCompleted) closing
	    	} //while line!=null
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


	public String parseReviews(String firstPart,String secondPart,String bookId, BufferedReader br) {
		secondPart = secondPart.trim();

		String[] reviewStrings = secondPart.split(" ");
		secondPart = "";

		try {
			int totalReviews=0;
			int reviewIterator=0;

			for(reviewIterator=0;reviewIterator<reviewStrings.length;reviewIterator++) {

				String reviewString = reviewStrings[reviewIterator].trim();
				if("downloaded:".equals(reviewString)) {
					//Total number of reviews: the number value after 'total:'
					reviewStrings[reviewIterator+1] = reviewStrings[reviewIterator+1].trim().split("\\s")[0];
					totalReviews = Integer.parseInt(reviewStrings[reviewIterator+1].trim());
					//System.out.println("Total "+totalReviews);

				}
			}
			//The last string is the average Rating. - TODO
			//System.out.println("Average ratign "+reviewStrings[reviewIterator-1].trim());
			secondPart=reviewStrings[reviewIterator-1].trim();
			//Scan the next 'totalReviews' number of lines
			int scanReviewIterator=0;
			while(scanReviewIterator<totalReviews) {

				String line = br.readLine();
	            line = line.trim(); //Read every line and trim it
				String newReview = "";
	            if(line!=null) {
	            	line = line.replaceAll("\\s+", " ");
	            	String reviewParts[] = line.split("\\s");
	            	
	            	for(String reviewPart : reviewParts) {
	            		if(!reviewPart.contains(":")) {
	            			newReview+=reviewPart+"\t";	 
	            		}
	        		}
	            }
	            if(!bookId.equals("")) {
	            	writeReviewsForProductsMapping(bookId,newReview);
	            }
	            //System.out.println(newReview);
	            scanReviewIterator++;
			}
			
		} catch (Exception e) {
	        System.err.println("Error: "+e.getMessage());
	        e.printStackTrace();
	    }
	    //System.out.println(secondPart);
	    return secondPart;
	}


	/**
	* To write product and review lines into file
	*/
	public void writeReviewsForProductsMapping(String product,String review) {
		try {
			String lineSeparator = System.getProperty("line.separator");
			File file = new File("SQLDataFiles/product_review_table.txt");
			if (!file.exists()) {
				file.createNewFile();
			}

			FileWriter fw = new FileWriter(file.getAbsoluteFile(),true); //to append - true
			BufferedWriter bw = new BufferedWriter(fw);
			bw.write(product+"\t"+review);
			bw.write(lineSeparator);
			bw.close();
		} catch(Exception e) {
        	System.err.println("Error: " );
        	e.printStackTrace();
		}
	}

	public String parseSimilar(String firstPart,String secondPart,String bookId) {
		//For the column similar
		secondPart = secondPart.trim();
		String[] partsInSecondPart = secondPart.split("\\s");
		secondPart=partsInSecondPart[0];

		//For updating the 'similar' values
		if(partsInSecondPart[0].trim().equals("0")) {
				//This means 0 similar objects
			} else {
				//This means more than 0 similar objects
				if(!bookId.equals("")) {
					for(int iterator=1;iterator<partsInSecondPart.length;iterator++) {
						//similarMap.put(bookId,partsInSecondPart);
						if(!partsInSecondPart[iterator].trim().equals(""))
						writeSimilarProductsMapping(bookId,partsInSecondPart[iterator]);
					}
				}
			}
		return secondPart;
	}

	/**
	* To write product and similar into file
	*/
	public void writeSimilarProductsMapping(String product,String similar) {
		try {
			String lineSeparator = System.getProperty("line.separator");
			File file = new File("SQLDataFiles/product_similar_table.txt");
			if (!file.exists()) {
				file.createNewFile();
			}

			FileWriter fw = new FileWriter(file.getAbsoluteFile(),true); //to append - true
			BufferedWriter bw = new BufferedWriter(fw);
			bw.write(product+"\t"+similar);
			bw.write(lineSeparator);
			bw.close();
		} catch(Exception e) {
        	System.err.println("Error: " );
        	e.printStackTrace();
		}
	}

	/**
	* To write book and category file
	*/
	public void writeBookCategoryMapping(String book,String category) {
		try {
			String lineSeparator = System.getProperty("line.separator");
			File file = new File("SQLDataFiles/product_category_table.txt");
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
			File file = new File("SQLDataFiles/category_table.txt");
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
			File file = new File("SQLDataFiles/products_table.txt");
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