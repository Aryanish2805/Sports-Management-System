require('dotenv').config();
const mongoose = require('mongoose');
const Tournament = require('./models/Tournament');
const Team = require('./models/Team');
const Match = require('./models/Match');
const Standing = require('./models/Standing');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, {}).then(async () => {
  console.log('✅ Connected to DB');

  // Clear old data
  await Match.deleteMany({});
  await Standing.deleteMany({});
  await Team.deleteMany({});
  await Tournament.deleteMany({});
  console.log('🗑️  Cleared old tournaments, teams, matches, standings');

  // Get admin & manager users
  const admin   = await User.findOne({ email: 'admin@sports.com' });
  const manager = await User.findOne({ email: 'manager@sports.com' });
  if (!admin || !manager) {
    console.error('❌ Run seed_user.js first!');
    process.exit(1);
  }

  // ──────────────────────────────────────────────
  // TOURNAMENTS
  // ──────────────────────────────────────────────
  const now = new Date();
  const d = (offset) => { const x = new Date(now); x.setDate(x.getDate() + offset); return x; };

  const [t1, t2, t3, t4] = await Tournament.insertMany([
    {
      name: 'Inter-IIT Cricket Championship 2026',
      sport_type: 'Cricket',
      description: 'Premier cricket championship contested among the top IITs across India, featuring fierce inter-college rivalry and elite student athletes.',
      start_date: d(-30), end_date: d(10),
      status: 'ongoing', organizer: admin._id,
      max_teams: 16, format: 'group_stage',
    },
    {
      name: 'All India University Football League',
      sport_type: 'Football',
      description: 'The biggest college football league in India, uniting teams from SRM, VIT, BITS, NITs and top universities in an electrifying season.',
      start_date: d(-15), end_date: d(20),
      status: 'ongoing', organizer: admin._id,
      max_teams: 16, format: 'league',
    },
    {
      name: 'National College Basketball Cup',
      sport_type: 'Basketball',
      description: 'A high-intensity knockout basketball tournament bringing together the finest college ballers from institutions across India.',
      start_date: d(5), end_date: d(30),
      status: 'upcoming', organizer: admin._id,
      max_teams: 8, format: 'knockout',
    },
    {
      name: 'South India Volleyball Championship',
      sport_type: 'Volleyball',
      description: 'An intense volleyball championship featuring top southern universities — SRM, VIT, Manipal, Amrita, SASTRA and more.',
      start_date: d(-60), end_date: d(-5),
      status: 'completed', organizer: admin._id,
      max_teams: 8, format: 'group_stage',
    },
  ]);
  console.log('🏆 Tournaments created');

  // ──────────────────────────────────────────────
  // TEAMS — Cricket (t1): IITs
  // ──────────────────────────────────────────────
  const colors = [
    '#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6',
    '#06b6d4','#f43f5e','#84cc16','#6366f1','#14b8a6',
    '#fb923c','#ec4899','#a855f7','#0ea5e9','#22c55e','#eab308',
  ];

  const cricketTeams = await Team.insertMany([
    { name: 'IIT Bombay Techfest XI', tournament: t1._id, manager: manager._id, contact_info: 'sports@iitb.ac.in', logo_color: colors[0], members: ['Arjun Sharma','Rohit Nair','Karan Singh','Dev Patel','Aarav Mehta','Rishi Kumar','Sai Reddy','Vivek Joshi','Nikhil Rao','Aditya Gupta','Manish Tiwari'] },
    { name: 'IIT Delhi Warriors', tournament: t1._id, manager: manager._id, contact_info: 'sports@iitd.ac.in', logo_color: colors[1], members: ['Priya Sharma','Varun Khanna','Tarun Mishra','Lokesh Yadav','Harsh Agarwal','Amol Desai','Siddharth Roy','Rajeev Kumar','Pranav Sen','Deepak Verma','Ankit Bhatt'] },
    { name: 'IIT Madras Sharks', tournament: t1._id, manager: manager._id, contact_info: 'sports@iitm.ac.in', logo_color: colors[2], members: ['Vijay Balaji','Karthik Rajan','Surya Prakash','Arun Venkat','Naveen Krishnan','Bala Subramaniam','Vignesh Murugan','Senthil Kumar','Dinesh Rajendran','Muthu Selvam','Jeeva Raman'] },
    { name: 'IIT Kharagpur Lions', tournament: t1._id, manager: manager._id, contact_info: 'sports@iitkgp.ac.in', logo_color: colors[3], members: ['Rajesh Das','Subhash Mondal','Biplab Ghosh','Arnab Bose','Sourav Chakraborty','Debashis Pal','Anirban Sen','Pritam Roy','Sumit Dey','Partha Banerjee','Utsav Sinha'] },
    { name: 'IIT Kanpur Falcons', tournament: t1._id, manager: manager._id, contact_info: 'sports@iitk.ac.in', logo_color: colors[4], members: ['Abhishek Tiwari','Neeraj Joshi','Vivek Srivastava','Pushkar Singh','Anupam Yadav','Raghav Sharma','Manish Dubey','Ajay Pandey','Dhruv Mishra','Rakesh Gupta','Pankaj Khanna'] },
    { name: 'IIT Roorkee Thunderbolts', tournament: t1._id, manager: manager._id, contact_info: 'sports@iitr.ac.in', logo_color: colors[5], members: ['Himanshu Negi','Gaurav Rawat','Sandeep Bisht','Deepak Chauhan','Suresh Thakur','Mohit Sharma','Piyush Joshi','Ravi Bhatt','Anil Kumar','Ramesh Verma','Sunil Rana'] },
    { name: 'IIT Hyderabad Eagles', tournament: t1._id, manager: manager._id, contact_info: 'sports@iith.ac.in', logo_color: colors[6], members: ['Srikant Reddy','Manoj Varma','Suresh Rao','Harish Kumar','Naveen Babu','Ravi Teja','Chetan Naik','Pranay Sharma','Aakash Singh','Rahul Naidu','Vikram Bhat'] },
    { name: 'IIT Guwahati Storm', tournament: t1._id, manager: manager._id, contact_info: 'sports@iitg.ac.in', logo_color: colors[7], members: ['Biki Das','Pranab Gogoi','Ranjit Baruah','Dipak Saikia','Nayan Deka','Arup Bora','Jitu Kalita','Bikash Sarma','Manash Das','Pranjal Hazarika','Nilotpal Choudhury'] },
  ]);

  // ──────────────────────────────────────────────
  // TEAMS — Football (t2): SRM, VIT, BITS, NITs etc
  // ──────────────────────────────────────────────
  const footballTeams = await Team.insertMany([
    { name: 'SRM United FC', tournament: t2._id, manager: manager._id, contact_info: 'sports@srmist.edu.in', logo_color: colors[0], members: ['Kiran Pillai','Jose Thomas','Akhil Nair','Seby Joseph','Jijo Mathew','Rony Philip','Jobin George','Sanu Paul','Alin James','Binu Raj','Kevin Koshy'] },
    { name: 'VIT Vellore FC', tournament: t2._id, manager: manager._id, contact_info: 'sports@vit.ac.in', logo_color: colors[2], members: ['Ajay Kumar','Sai Ganesh','Ravi Shankar','Arun Kumar','Suresh Babu','Vimal Raj','Manikandan P','Saravanan R','Durai Murugan','Yuvaraj T','Prakash N'] },
    { name: 'BITS Pilani Stormers', tournament: t2._id, manager: manager._id, contact_info: 'sports@pilani.bits-pilani.ac.in', logo_color: colors[8], members: ['Harsh Lodha','Arpit Jain','Rohan Bansal','Sumit Agarwal','Vaibhav Singh','Anuj Sharma','Pulkit Gupta','Mohit Kumar','Saurabh Yadav','Kunal Joshi','Nitin Verma'] },
    { name: 'NIT Trichy Thunder', tournament: t2._id, manager: manager._id, contact_info: 'sports@nitt.edu', logo_color: colors[3], members: ['Balaji S','Sriram V','Muthu K','Karthick R','Arulraj D','Senthil B','Balachander N','Dinakaran P','Murugesan R','Ilayaraja S','Selvam T'] },
    { name: 'Manipal Mavericks', tournament: t2._id, manager: manager._id, contact_info: 'sports@manipal.edu', logo_color: colors[9], members: ['Rahul Shetty','Akash Prabhu','Nikhil Kamath','Rajesh Bhat','Shreyas Nayak','Vivek Alva','Girish Rao','Suresh Pai','Ramesh Kotian','Prakash Shenoy','Anand Hegde'] },
    { name: 'Delhi University Dynamos', tournament: t2._id, manager: manager._id, contact_info: 'sports@du.ac.in', logo_color: colors[1], members: ['Sahil Arora','Gaurav Bhatia','Rohit Kapoor','Vikas Malhotra','Deepak Chadha','Manish Khanna','Sachin Mehra','Pankaj Sood','Suresh Nanda','Aakash Luthra','Navneet Sharma'] },
    { name: 'Amrita University Lions', tournament: t2._id, manager: manager._id, contact_info: 'sports@amrita.edu', logo_color: colors[10], members: ['Anoop Nair','Sreejith Menon','Vishnu Prasad','Aravind Kumar','Harikrishnan R','Sajeev Suresh','Unnikrishnan P','Jithesh Kumar','Bibin Thomas','Sarath Chandran','Madhavan Pillai'] },
    { name: 'SASTRA University Kings', tournament: t2._id, manager: manager._id, contact_info: 'sports@sastra.edu', logo_color: colors[11], members: ['Suresh Kannan','Manikandan S','Vigneshwaran R','Karunanithi P','Sugumar N','Sundar Raj','Periyasamy M','Chellapandi R','Muthuraman K','Ramachandran S','Nagarajan T'] },
  ]);

  // ──────────────────────────────────────────────
  // TEAMS — Basketball (t3): Mix
  // ──────────────────────────────────────────────
  const basketTeams = await Team.insertMany([
    { name: 'IIT Bombay Blazers', tournament: t3._id, manager: manager._id, contact_info: 'sports@iitb.ac.in', logo_color: colors[0], members: ['Arjun Kapoor','Rahul Singh','Vikram Khanna','Siddharth Rege','Aditya Kulkarni','Yash Patel','Rohan Desai','Tanmay Joshi','Kiran Sawant','Abhay Naik','Parth Shah'] },
    { name: 'VIT Chennai Bulls', tournament: t3._id, manager: manager._id, contact_info: 'sports@vit.ac.in', logo_color: colors[2], members: ['Nathan Johnson','Arjun Rajan','Sanjay Kumar','Mithun Raj','Pradeep Nair','Jenson Paul','Britto Xavier','Danish Khan','Kevin Thomas','Faiz Ahmed','Robin Varghese'] },
    { name: 'BITS Goa Rockets', tournament: t3._id, manager: manager._id, contact_info: 'sports@goa.bits-pilani.ac.in', logo_color: colors[5], members: ['Shivam Bose','Ayush Thakur','Kshitij Mehta','Sarthak Shah','Pranav Pillai','Nishant Gupta','Varun Jain','Tanish Agarwal','Rishi Mishra','Ojas Verma','Abhi Rana'] },
    { name: 'Jadavpur University Jets', tournament: t3._id, manager: manager._id, contact_info: 'sports@jadavpur.edu', logo_color: colors[3], members: ['Soumik Bose','Arnab Ray','Rituparna Das','Suman Ghosh','Debabrata Pal','Subhajit Mukherjee','Anindya Sen','Bodhisatva Dutta','Srijit Roy','Atish Chakraborty','Rupam Chatterjee'] },
  ]);

  // ──────────────────────────────────────────────
  // TEAMS — Volleyball (t4): South India
  // ──────────────────────────────────────────────
  const volleyTeams = await Team.insertMany([
    { name: 'SRM Spikes', tournament: t4._id, manager: manager._id, contact_info: 'sports@srmist.edu.in', logo_color: colors[0], members: ['Anbu Raj','Kumaran S','Selvakumar T','Ramu N','Gopal K','Suresh M','Ramesh P','Dinesh R','Muthu S','Kumar V','Siva R'] },
    { name: 'VIT Smashers', tournament: t4._id, manager: manager._id, contact_info: 'sports@vit.ac.in', logo_color: colors[2], members: ['Arun M','Vijay K','Suresh R','Manoj P','Ravi S','Kumar N','Shankar T','Prakash V','Ganesh B','Murugan S','Karthik R'] },
    { name: 'Amrita Aces', tournament: t4._id, manager: manager._id, contact_info: 'sports@amrita.edu', logo_color: colors[4], members: ['Sree Kumar','Aravind B','Harish M','Rajesh N','Ajay P','Deepak S','Suraj V','Nithish R','Ashwin K','Prashanth G','Vineeth T'] },
    { name: 'NIT Calicut Crushers', tournament: t4._id, manager: manager._id, contact_info: 'sports@nitc.ac.in', logo_color: colors[6], members: ['Faisal K','Habeeb M','Shafeeq A','Noushad B','Salim C','Riyas D','Rashid E','Aboobacker F','Hamza G','Basheer H','Shajahan I'] },
  ]);
  console.log('🏫 Teams created');

  // ──────────────────────────────────────────────
  // Helper — create match + update standings
  // ──────────────────────────────────────────────
  async function ensureStanding(teamId, tournId) {
    let s = await Standing.findOne({ team: teamId, tournament: tournId });
    if (!s) s = await Standing.create({ team: teamId, tournament: tournId });
    return s;
  }

  async function createMatch({ tournament, team1, team2, score1, score2, date, venue, status, round }) {
    const winner = status === 'completed'
      ? (score1 > score2 ? team1 : score2 > score1 ? team2 : null)
      : null;
    await Match.create({ tournament, team1, team2, score1, score2, date, venue, status, round, winner });

    if (status === 'completed') {
      const s1 = await ensureStanding(team1, tournament);
      const s2 = await ensureStanding(team2, tournament);

      s1.played++; s2.played++;
      s1.goals_for += score1; s1.goals_against += score2;
      s2.goals_for += score2; s2.goals_against += score1;

      if (score1 > score2)      { s1.wins++; s1.points += 3; s2.losses++; }
      else if (score2 > score1) { s2.wins++; s2.points += 3; s1.losses++; }
      else                       { s1.draws++; s2.draws++; s1.points += 1; s2.points += 1; }

      await s1.save(); await s2.save();
    }
  }

  // ──────────────────────────────────────────────
  // MATCHES — Cricket (Group Stage)
  // ──────────────────────────────────────────────
  const ct = cricketTeams;
  const cricketFixtures = [
    // Completed
    [ct[0],ct[1],185,142,d(-28),'Wankhede Stadium, Mumbai','completed','Group A'],
    [ct[2],ct[3],210,178,d(-26),'Chepauk, Chennai','completed','Group A'],
    [ct[4],ct[5],165,160,d(-24),'Green Park, Kanpur','completed','Group B'],
    [ct[6],ct[7],198,155,d(-22),'Rajiv Gandhi Stadium, Hyderabad','completed','Group B'],
    [ct[0],ct[2],220,205,d(-20),'Wankhede Stadium, Mumbai','completed','Group A'],
    [ct[1],ct[3],175,180,d(-18),'Feroz Shah Kotla, Delhi','completed','Group A'],
    [ct[4],ct[6],190,145,d(-16),'Green Park, Kanpur','completed','Group B'],
    [ct[5],ct[7],160,175,d(-14),'Sawai Mansingh, Jaipur','completed','Group B'],
    [ct[0],ct[3],230,190,d(-12),'Wankhede Stadium, Mumbai','completed','Group A'],
    [ct[1],ct[2],170,168,d(-10),'Feroz Shah Kotla, Delhi','completed','Group A'],
    [ct[4],ct[7],205,195,d(-8),'Green Park, Kanpur','completed','Group B'],
    [ct[5],ct[6],180,155,d(-6),'Sawai Mansingh, Jaipur','completed','Group B'],
    // Ongoing/Scheduled
    [ct[0],ct[4],115,98,d(-1),'Wankhede Stadium, Mumbai','ongoing','Semi Finals'],
    [ct[2],ct[5],0,0,d(2),'Chepauk, Chennai','scheduled','Semi Finals'],
    [ct[0],ct[2],0,0,d(8),'Eden Gardens, Kolkata','scheduled','Final'],
  ];

  for (const [team1,team2,score1,score2,date,venue,status,round] of cricketFixtures) {
    await createMatch({ tournament: t1._id, team1: team1._id, team2: team2._id, score1, score2, date, venue, status, round });
  }
  console.log('🏏 Cricket matches created');

  // ──────────────────────────────────────────────
  // MATCHES — Football (League)
  // ──────────────────────────────────────────────
  const ft = footballTeams;
  const footballFixtures = [
    [ft[0],ft[1],3,1,d(-13),'Jawaharlal Nehru Stadium','completed','Matchday 1'],
    [ft[2],ft[3],2,2,d(-13),'Ambedkar Stadium','completed','Matchday 1'],
    [ft[4],ft[5],1,0,d(-13),'Salt Lake Stadium','completed','Matchday 1'],
    [ft[6],ft[7],4,2,d(-13),'GMC Balayogi','completed','Matchday 1'],
    [ft[1],ft[2],0,1,d(-11),'Ambedkar Stadium','completed','Matchday 2'],
    [ft[3],ft[4],2,1,d(-11),'Salt Lake Stadium','completed','Matchday 2'],
    [ft[5],ft[6],1,3,d(-11),'Fatorda Stadium','completed','Matchday 2'],
    [ft[7],ft[0],0,2,d(-11),'GMC Balayogi','completed','Matchday 2'],
    [ft[0],ft[2],2,0,d(-9),'Jawaharlal Nehru Stadium','completed','Matchday 3'],
    [ft[1],ft[4],1,1,d(-9),'Ambedkar Stadium','completed','Matchday 3'],
    [ft[3],ft[6],0,2,d(-9),'Salt Lake Stadium','completed','Matchday 3'],
    [ft[5],ft[7],3,0,d(-9),'Fatorda Stadium','completed','Matchday 3'],
    [ft[0],ft[3],3,0,d(-7),'Jawaharlal Nehru Stadium','completed','Matchday 4'],
    [ft[2],ft[5],1,1,d(-7),'Ambedkar Stadium','completed','Matchday 4'],
    [ft[4],ft[7],2,1,d(-7),'Salt Lake Stadium','completed','Matchday 4'],
    [ft[1],ft[6],0,1,d(-7),'GMC Balayogi','completed','Matchday 4'],
    // Upcoming
    [ft[0],ft[5],0,0,d(2),'Jawaharlal Nehru Stadium','scheduled','Matchday 5'],
    [ft[2],ft[7],0,0,d(2),'Ambedkar Stadium','scheduled','Matchday 5'],
    [ft[1],ft[3],0,0,d(4),'GMC Balayogi','scheduled','Matchday 5'],
    [ft[4],ft[6],0,0,d(4),'Salt Lake Stadium','scheduled','Matchday 5'],
  ];

  for (const [team1,team2,score1,score2,date,venue,status,round] of footballFixtures) {
    await createMatch({ tournament: t2._id, team1: team1._id, team2: team2._id, score1, score2, date, venue, status, round });
  }
  console.log('⚽ Football matches created');

  // ──────────────────────────────────────────────
  // MATCHES — Basketball (Knockout — all scheduled)
  // ──────────────────────────────────────────────
  const bt = basketTeams;
  const basketFixtures = [
    [bt[0],bt[1],0,0,d(6),'Indoor Arena, IIT Bombay','scheduled','Quarter Final'],
    [bt[2],bt[3],0,0,d(6),'Indoor Arena, BITS Goa','scheduled','Quarter Final'],
    [bt[0],bt[2],0,0,d(15),'National Sports Complex','scheduled','Semi Final'],
    [bt[1],bt[3],0,0,d(25),'National Sports Complex','scheduled','Final'],
  ];
  for (const [team1,team2,score1,score2,date,venue,status,round] of basketFixtures) {
    await createMatch({ tournament: t3._id, team1: team1._id, team2: team2._id, score1, score2, date, venue, status, round });
  }
  console.log('🏀 Basketball matches created');

  // ──────────────────────────────────────────────
  // MATCHES — Volleyball (Completed)
  // ──────────────────────────────────────────────
  const vt = volleyTeams;
  const volleyFixtures = [
    [vt[0],vt[1],3,1,d(-55),'SRM Indoor Court','completed','Group Stage'],
    [vt[2],vt[3],3,0,d(-55),'Amrita Sports Hall','completed','Group Stage'],
    [vt[0],vt[2],2,3,d(-50),'SRM Indoor Court','completed','Group Stage'],
    [vt[1],vt[3],3,2,d(-50),'VIT Sports Complex','completed','Group Stage'],
    [vt[0],vt[3],3,0,d(-45),'SRM Indoor Court','completed','Group Stage'],
    [vt[1],vt[2],1,3,d(-45),'VIT Sports Complex','completed','Group Stage'],
    [vt[2],vt[0],3,2,d(-20),'Amrita Sports Hall','completed','Semi Final'],
    [vt[1],vt[3],0,3,d(-20),'VIT Sports Complex','completed','Semi Final'],
    [vt[2],vt[3],3,1,d(-10),'SRM Indoor Court','completed','Final'],
    [vt[0],vt[1],3,0,d(-10),'SRM Indoor Court','completed','3rd Place'],
  ];
  for (const [team1,team2,score1,score2,date,venue,status,round] of volleyFixtures) {
    await createMatch({ tournament: t4._id, team1: team1._id, team2: team2._id, score1, score2, date, venue, status, round });
  }
  console.log('🏐 Volleyball matches created');

  // ──────────────────────────────────────────────
  // Ensure all teams have a standing entry (even 0)
  // ──────────────────────────────────────────────
  for (const team of [...cricketTeams, ...footballTeams, ...basketTeams, ...volleyTeams]) {
    await ensureStanding(team._id, team.tournament);
  }

  console.log('\n🎉 All seed data inserted successfully!');
  console.log(`   Tournaments : 4`);
  console.log(`   Teams       : ${cricketTeams.length + footballTeams.length + basketTeams.length + volleyTeams.length}`);
  console.log(`   Matches     : ${cricketFixtures.length + footballFixtures.length + basketFixtures.length + volleyFixtures.length}`);
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
