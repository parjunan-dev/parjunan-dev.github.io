Lab.12.7 - Email Channel Configuration
Table of Contents
Topic	Lab Type	Difficulty Level	Estimated length
Gmail account configuration	Practical Lab	EASY	5 min
Create Email Asset and Register to WebeXCC	Practical Lab	EASY	5 min
Email Entry Point and Queue creation	Practical Lab	EASY	5 min
Create/Upload Email flow	Practical Lab	EASY	5 min
Verification: Send an Email and accept the task	Practical Lab	EASY	5 min
Introduction
Lab Objective
In this Lab, we will go through the tasks that are required to complete the basic email configuration. You will be able to initiate an email to the Contact Center and be able to accept/respond to the email by logging in as an agent.

In this lab you will be configuring Gmail Account settings, Email Assets, Entry Point and corresponding workflows. All those steps are required for connecting the Email account with our application.

Pre-requisite
You received an admin credentials to configure in Management Portal and Webex Connect.
You received Email account credentials.
You have successfully completed the previous Lab12.5 Pre-configuration.
Quick Links
Control Hub: https://admin.webex.com
US Portal: https://portal.wxcc-us1.cisco.com/portal
US Agent Desktop: https://desktop.wxcc-us1.cisco.com
UK Portal: https://portal.wxcc-eu1.cisco.com/portal
UK Agent Desktop: https://desktop.wxcc-eu1.cisco.com
EMEA Portal: https://portal.wxcc-eu2.cisco.com/portal
EMEA Agent Desktop: https://desktop.wxcc-eu2.cisco.com
ANZ Portal: https://portal.wxcc-anz1.cisco.com/portal
ANZ Agent Desktop: https://desktop.wxcc-anz1.cisco.com
Webex Connect Documentation: https://help.imiconnect.io/

Configuration Order
DC_Lab.12.7_Email_ConfigurationOrder

1. Gmail account configuration
Starting from May 30 the Less Secure Apps feature was disabled on all Google accounts. As long as this setting was enabled, it was possible to send emails via Gmail SMTP. In this lab, we will be using new OAuth 2.0 authentication for outbound email functionality.

Note: For this lab, we have created a Gmail account. Optionally, use your own account for polling and handling the emails. It can be a Gmail account or Office 365 account or any account which has email forwarding. The instructions below are applicable only for the Gmail accounts.

1. Gmail forwarding activation (for incoming emails)
User email
cl1webex**<ID>**@gmail.com
Note: Your <ID> was provided to you personally. <ID> is the unique number equal to your POD.

Login to the Gmail account with the credentials above https://mail.google.com. The password is the same as for Webex admin account. During first login select Turn off smart features.
Enable POP3/IMAP setting by clicking on settings icon on top right corner and selecting See all settings.
DC_Lab.12.7_Gmail_account_configuration_1

Now Click on Forwarding and POP/IMAP, enable the POP Download and IMAP access then click Save Changes.
DC_Lab.12.7_Gmail_account_configuration_2

2. Create a project at Google API Console
We need to activate API if we want to use Gmail account for outbound emails.

Login to Google Developers Console with the credentials above. The password is the same as for Webex Contact Center admin account.
You will have to agree with the Terms of Service and pick their Country of residence. Then click Select a project and create a NEW PROJECT.
DC_Lab.12.7_Create_new_project_at_Google_API_Console_1

Keep the default project's name and press Create at the bottom. Make sure that now you have selected this project.
DC_Lab.12.7_Create_new_project_at_Google_API_Console_2

3. Enable Gmail API (for outgoing emails)
Enter Gmail API in the search bar and click on it once found.
DC_Lab.12.7_Enable_Gmail_API_1

You need to enable the API for your project by clicking on ENABLE button.
DC_Lab.12.7_Enable_Gmail_API_2

4. Configure OAuth Consent Screen and Scopes
Once the API is enabled, you’ll be taken to a nice dashboard that says, "To use this API, you may need credentials".
DC_Lab.12.7_Configure_OAuth_Consent_Screen_and_Scopes_1

To create an OAuth client ID, you must first configure your consent screen. Under the APIs and Services section, click on OAuth Consent Screen, set the user type as External and click CREATE button.
DC_Lab.12.7_Configure_OAuth_Consent_Screen_and_Scopes_2

It will bring you to a page with many fields. Just enter the App name as WebexCCEmails, choose your User support email and enter the same email in the Developer contact information. In the end press SAVE AND CONTINUE.
DC_Lab.12.7_Configure_OAuth_Consent_Screen_and_Scopes_3

On the next screen, you need to provide Auth 2.0 Scopes for Google APIs. Click the Add Or Remove Scopes button and add https://www.googleapis.com/auth/gmail.send to the list of scopes since we only want to send emails from Gmail and not read any user data. Click SAVE AND CONTINUE.
DC_Lab.12.7_Configure_OAuth_Consent_Screen_and_Scopes_4

On the test user page, click ADD USERS and enter your Gmail address. Click Save and Continue.
DC_Lab.12.7_Configure_OAuth_Consent_Screen_and_Scopes_5

5. Credentials and authentication with OAuth 2.0
Now create a new client ID that will be used to identify your application to Google’s OAuth servers.

In the APIs & Services section, click on Credentials and then pick OAuth client ID from the drop-down list of the CREATE CREDENTIALS button.
DC_Lab.12.7_Credentials_and_authentication_with_OAuth_2.0_1

Select Web application in the Application type
You can leave the default name. The name of your OAuth 2.0 client is only used to identify the client in the Google Cloud console and will not be shown to application users.
In the Authorized redirect URIs section click ADD URI button and set https://cl1pod\<ID\>.webexconnect.io/callback where <ID> is your tenant number. Click CREATE button in the end.
DC_Lab.12.7_Credentials_and_authentication_with_OAuth_2.0_2

Download a JSON file with your credentials – you’ll need it later.
DC_Lab.12.7_Credentials_and_authentication_with_OAuth_2.0_3

