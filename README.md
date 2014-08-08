![image](http://i.imgur.com/mRd44Fm.png =300x)
=========
<br></br>

## The Application

WhereIsIt is a mobile/web application which makes your life easier.
It helps any kind of user to find any business around him by using a clean, simple and friendly platform.

WhereIsIt supplies a variety of search options for a business, such as:

* By Name
* By Address
* By Rating
* By user reviews
* By current location (Smart GPS Only)

With WhereIsIt, finding the relevant business is easy and keep you away from being busy.

Moreover, businesses owners can publish their businesses on WhereIsIt platform which makes user to be able to review, rate and navigate to those businesses.

It helps businesses owners with a free, clean and simple advertising platform.

<br></br>
## Functional Requirements

1. Application Register
	- Form
	- Facebook ID
	<br></br>
2. Search for a business
	- By name
	- By address
	- By current location
	- By rating
	- By ammount of rating
	- by ammount of reviews
	- By Favourites
		<br></br>
3. Add a business
	- name
	- type
	- address
	- description
		<br></br>		
4. Rate a business
	- Rate as an anonymous user
	- Rate as a logged in user
	<br></br>
5. Add a review to a business
 	- Review as an anonymous user
	- Review as a logged in user
	<br></br>		
6. Quick navigate to a business
	- By Google/Waze
	<br></br>
<br></br>

## The Application Environment


* Clients

	The average WhereIsIt application user is any kind of 18+ y/o person who know 	how to browse the internet online and in addition holds a smartphone for a 	daily use.

* Suppliers

	There are no business interaction with suppliers, users are the only suppliers 	of information in WhereIsIt application.

* Substitutes

	Users can open a browser and start looking for the business which relevant for 	them, which this option is of course less comfortable.
	Also, a user can call 144 service and look for relevant business, which this 	option is of course less comfortable.

* Competitors

	Name | GPS Support | Search by current location | free advertising
------------ | ------------- | ------------ | ------------
WhereIsIt | ![image](http://images.all-free-download.com/images/graphiclarge/green_globe_ok_tic_584.jpg =50x)  | ![image](http://images.all-free-download.com/images/graphiclarge/green_globe_ok_tic_584.jpg =50x) | ![image](http://images.all-free-download.com/images/graphiclarge/green_globe_ok_tic_584.jpg =50x)
easy.co.il | ![image](http://www.clker.com/cliparts/8/3/3/4/1195445190322000997molumen_red_round_error_warning_icon.svg.med.png =50x) | ![image](http://www.clker.com/cliparts/8/3/3/4/1195445190322000997molumen_red_round_error_warning_icon.svg.med.png =50x) | ![image](http://www.clker.com/cliparts/8/3/3/4/1195445190322000997molumen_red_round_error_warning_icon.svg.med.png =50x)
d.co.il | ![image](http://www.clker.com/cliparts/8/3/3/4/1195445190322000997molumen_red_round_error_warning_icon.svg.med.png =50x)  | ![image](http://www.clker.com/cliparts/8/3/3/4/1195445190322000997molumen_red_round_error_warning_icon.svg.med.png =50x) | ![image](http://www.clker.com/cliparts/8/3/3/4/1195445190322000997molumen_red_round_error_warning_icon.svg.med.png =50x)
		
<br></br>

## Target Market

WhereIsIt application is made for:

* Tourists which wants to navigate easily by searching specific businesses.
* Businesses owners who seek for free advertising for their business.
* People who simply looks for nearest relevant business (Gas station, hospital, etc.)
* People who are wants to discover new entertaintment options, such as cinema, restourants, bars etc.
* People who would like to rate for good/bad a business they have just visited.
<br></br>

## Business Procesess

1. Search a business by location
	
	The user press the gps button which allows the application to focus on 	its current location.
	Just after that, all business nearby the user current location appears.
	
	Now, the user have the option to insert a business name in a textbox, and if 	that business exists nearby, it'll appear in results, otherwise, the results 	will be empty.
	<br></br>
	![image](http://i.imgur.com/fz3ZLaK.png =650x)
	<br></br>
	
2. Search a business by different criteria (name, category, address)
	
	The user insert in textbox what to search which can be a business name, 	category or address.
	
	Now, if there is a singple business relevant to that name/category/address, 	it'll be shown in results.
	If there are multiple businesses relevant, they will be all shown in resulsts.
	Otherwise, no businesses will be shown in results.

	<br></br>
	![image](http://i.imgur.com/stNDqWH.png =650x)
	<br></br>
	
3. Add a review for a business

	The user search and found a specific business (by any kind of search option).
	Then, the user adds a review which contains:
	* business rate
	* review content
	* if the user is logged in, the user personal info will be shown (first and last name, profile picture)
	
	<br></br>
	![image](http://i.imgur.com/J4jrnSf.png =650x)
	<br></br>

	

## ERD
<br></br>

The ERD represent the first design of our database relations between entities.
There are two main entities, User and Business, both contains smaller entities such as Address or Review.


![image](http://i.imgur.com/D86o3JH.png =650x)
<br></br>

## MongoDB Schemes
<br></br>
The MongoDB schemes below represent the implementation of the above ERD.
#### User
This entity represent the user model, which of course contains all obvious fields which a user needs (first name, username, password etc.).

Also, the user entity contains extra information of 3rd party business objects:
* reviewed businesses - all businesses which were reviewed by user appears here.
* last visited businesses - all businesses which the user last searched.
* owned businesses - all businesses the user created and owns in application.
	
	{
    	username    : String,
    	firstName   : String,
	    lastName    : String,
	    password    : String,
    	imagePath   : String,
	    reviewedBusinesses : [ Business ],
    	address     : Address,
	    lastVisitedBusinesses : [ Business ]
	    ownedBusinesses : [ Business ]
	}
	
#### Business
This entity represent the business model, which contains many fields related to a business, such as its rating, phone number, address, name, category etc.

	{
		businessId  : ObjectId,
    	name        : String,
	    address     : Address,
    	phone       : String,
	    email       : String,
    	imagePath   : String,
	    numOfScores : Number,
    	averageRating : Number,
		ratingCount : Number,
	    category        : String,
    	description : String,
	  	businessDays : [ BusinessDay ]
    	website     : String,
	    additionalInfo : { },
    	reviews     : [ Review ],
	}

#### BusinessDay
This entity represent the business day model, which contains the day and open/close hours.
	
	{
		businessDayId : ObjectId,
		day: String,
		openHour: String,
		closeHour: String,
	}

#### Review
This entity represent the review model which been added for a business.
Review contains the userId which responsible for the review, the businessId of the business been reviewed, the content and the date of created review.

	{
    	userId     : ObjectId,
	    businessId : ObjectId,
    	content    : String,
	    date       : Date,
	}

#### Address
This entity represent the address model, which contains the city, street and home number.

	{
		addressId  : ObjectId,
    	city       : String,
	    street     : String,
    	homeNumber : Number,
	}
<br></br>

## Queries examples



	FindBusinessByName(String name)
	InsertBusinessReview(ObjectId businessId, Review review)
	FindBusinessesByCurrentLocation(Address address, int radius)
	FindBusinessByScoreFilter(String businessType, int Score)

<br></br>
	
## WhereIsIt Application Technologies

#### Client Side
* Angular.js
* CSS3
* HTML5
* twitter.boostrap

#### Server Side
* Node.js
* Express
* Mongoose


