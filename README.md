# Giggle 
### Private Chat and Public Live Chat

Giggle Chat is a chat application with a Node.js backend which provides a blazingly fast and secure communication line for text-based chatting.

## General Features
- Chats saved into the database are Encrypted 
- Communication Links with Friend Request System
- Private Chats 
- Public Live Chat Camps  

## Technical Details
- Real Time Duplex Connection Rooms with [Socket.IO](socket.io)
- Secure Chat Data Encryption with [CryptoJS])(https://www.npmjs.com/package/crypto-js)
- Data Storage in [MongoDB](http://mongodb.github.io/node-mongodb-native/)
- [Express](http://expressjs.com/) used as Node Server and Routing framework 
- Server-side Rendering with [Handlebars](https://handlebarsjs.com/) Rendering Engine

###Sidenote:
Currently, [I](https://github.com/cyan-chatter) am modifying the data flow design of the application to implement Diffie Hellman Key Exchange Algorithm to provide secure end to end encryption. The work for this is in progress in the branch: Encrypt of this Repository. 
Any open source enthusiast is welcome to contribute :smiley:

For the current Dependencies of the appplication, check [package.json](https://github.com/cyan-chatter/giggle/blob/master/package.json) file.


