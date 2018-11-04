# MultiplayerJS

![Build Image](https://travis-ci.org/lghenk/MultiplayerJS.svg?branch=master)
![Dependencies](https://david-dm.org/lghenk/MultiplayerJS/status.svg)
![Dev Dependencies](https://david-dm.org/lghenk/MultiplayerJS/dev-status.svg)

A peer-to-peer replay multiplayer service written in NodeJS.
This system wil be made to work well with [this matchmaking system](https://github.com/lghenk/MatchmakingJS) but using the correct format any custom system can be integrated with this multiplayer service. 

This project also doubles as a school assignment (that I created my self).

## Certain Items worth pointing out
- 

## Software Analysis 
Most languages can handle TCP Sockets. I have sufficient proficiency in the following languages: C#, C++, JAVA & NodeJS(javascript)
that are suitable for this system

- C++: In C++ It is relatively hard to work with sockets and not only that you have to take care of your pointers and really make sure you are not creating any memory leaks. Since we will be working with a ton of reference to the clients socket in this project. I personally think it is not the best choice on the list HOWEVER it is extremely fast
+ C++ is not platform independent out of the box and it's not exactly the language to prototype in.

- C# & JAVA: Both languages are fast and reliable. Both languages are easily compiled for multiple OS'es 

- NodeJS: A non-IO blocking async language that works platform independent out of the box, Easily scalable for big projects and event-based programming here is practically required which for a system like this is favorable
- NodeJS: Is also very easy to write multi-threadded applications which in the case of a multiplayer service is indeed very useful

I decided to go with NodeJS because of its scalability and the fact that it can run on multiple platforms.
Also because of its Non-Blocking IO operations makes this quite desirable for large scale applications and its multi-threadding capabilities

## Goals of this project
- Have a functional multiplayer relay
- Master & Slave servers
- Get familiar with Git Flow
- Gain more experience with socket programming and its architecture
- Write a small wiki on how to interact with this system

## Planning 
| | Monday | Tuesday | Wednesday | Thursday | Friday |
| --- | --- | --- | --- | --- | --- |
|Week 1 | Start Step 1 | -> | Finish step 1 > start step 2 | -> | Finish step 2 > Start step 3
|Week 2 | -> | -> | -> | Finish step 3 > start step 4 | ->
|Week 3 | -> | -> | Finish step 4 Turn In Assignment | Write portfolio item | Fill in post-mortem form for school

### Step 1
- Start working out how this system should work
- Ability for matchmaking to connect and spawn clusters

### Step 2
- The server can accept clients send by matchmaking
- A basic form of packet forwarding
- Start writing the documentary

### Step 3
- Setup a test Unity Environment that can connect to matchmaking and multiplayer

### Step 4
- Create an actually playable game for testing

The above steps are for a basic multiplayer relay system which can and likely will grow in the future with more advanced features & implementations 

## Sources
- [NodeJS Clusters](https://nodejs.org/api/cluster.html)
- [TCP Server](https://nodejs.org/api/net.html)
- [Gitflow workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
