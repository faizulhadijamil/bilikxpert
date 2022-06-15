const initialState = Map({
  user: Map(),
  trainers: Map({
    'kish' :{
      id:'Ipy53HLUNw9gp4iAIU51',
      name:'kish',
      image:require('./assets/kish.jpg'),
      role:"Course Facilitator",
      experience: "4 years experience",
      bio:"With his amiable personality; it complements his obsession in corrective exercises and post injuries rehab."
    },
    'marta' :{
      id:'W2swMsZ2uUbHtH74dj7W',
      name:'marta',
      image:require('./assets/marta.jpg'),
      role:"Course Facilitator",
      experience: "7 years experience",
      bio:"Rock climber turned Pilates practitioner whom is also interested in endurance sports, injury prevention as well as psychology."
    },
    'jacq' :{
      id:'ryKu18l6i8SOjPZlw0Ou',
      name:'jacq',
      role:"Course Facilitator",
      image:require('./assets/jacq.jpg'),
      bio:"Passionate and unorthodox"
    },
    'cindy':{
      id:'DOCcSh3GfidTrRKINGPg',
      name:'cindy',
      image:require('./assets/cindy.jpg'),
      bio:"Fitness enthusiast who was inspired to become a fitness professional with a main goal to inspire people to live better. Now being a personal trainer Cindy is specialized in strength conditioning."
    },
    'ridz':{
      id:'U44naMHLPyuDBwXaA0XY',
      name:'ridz',
      image:require('./assets/ridz.jpg'),
      bio:"Consistence, persistence, drive and commitment, these are principles that he upholds in life."
    },
    'dansen':{
      id:'hMIbwOOR776zdDspa84z',
      name:'dansen',
      image:require('./assets/dansen.jpg'),
      role:"Education Manager",
      experience: "8 years experience",
      bio:"Engineer turned fitness enthusiast whom believes in continous learning to better oneself and also a firm believer in paying it forward."
    },
    'boon':{
      id:'zcUCEdDbp84MjdUSwf6c',
      name:'boon'
    },
    'maybelline':{
      id:'w5SoRtxTnku5JuaqYqQE',
      name:'maybelline',
      image:require('./assets/maybelline.jpg'),
      role:"Dance Coach",
      experience: "8 years experience",
      bio:"One of the key faces in the dance scene. Multifaceted and highly talented dancer, choreographer, teacher, workshop organiser, music video choreographer and scene influencer"
    },
    'tony':{
      id:'yZyCVecg9kpyKmoOT8sK',
      name:'tony',
      role:"Course Facilitator",
      experience: "10+ years experience",
      bio:"A Budokon Yoga maestro which is a form of mixed movement arts that complements his love for human functional motions"
    },
    'hanna':{
      id:'bozdunV3jhvmG1dxuCMp',
      name:'hanna',
      image:require('./assets/hanna.jpg'),
      role:"Course Facilitator",
      experience: "6 Years Experience",
      bio:"Turned her passion into a career with a focus on educating females on benefits of strength and conditioning"
    },
  }),
  classes:Map({
    'hiit' : {
      id:'aay1x3svPUsDmtgxCRrB',
      active:true,
      slug:'hiit',
      name:'HIIT',
      description: "Whoever said that a short workout can't be effective haven't met our Babel Team. Join the HIIT class and see for yourself!",
      longDescription:"A high intensity interval workout designed to increase athletic performance and set your calories on fire. HIIT keeps you moving and challenges not only your body but also your mind. Bring it, beat it and brag about it !",
      image:require('./assets/HIIT.jpg'),
      maxCapacity:22,
      duration:30,
      venue:'HIIT Room',
      sessions:{
        0:{
          dateTime:'2017-12-11 07:30:00',
          trainer:'kish',
          details:'Upper Body'
        },
        1:{
          dateTime:'2017-12-11 20:30:00',
          trainer:'jacq',
          details:'Upper Body'
        },
        2:{
          dateTime:'2017-12-12 08:30:00',
          trainer:'dansen',
          details:'Lower Body'
        },
        3:{
          dateTime:'2017-12-12 18:30:00',
          trainer:'jacq',
          details:'Lower Body'
        },
        4:{
          dateTime:'2017-12-13 07:30:00',
          trainer:'ridz',
          details:'Full Body'
        },
        5:{
          dateTime:'2017-12-13 20:30:00',
          trainer:'cindy',
          details:'Full Body'
        },
        6:{
          dateTime:'2017-12-14 08:30:00',
          trainer:'jacq',
          details:'Upper Body'
        },
        7:{
          dateTime:'2017-12-14 18:30:00',
          trainer:'cindy',
          details:'Upper Body'
        },
        8:{
          dateTime:'2017-12-14 20:30:00',
          trainer:'dansen',
          details:'Upper Body'
        },
        9:{
          dateTime:'2017-12-15 07:30:00',
          trainer:'kish',
          details:'Lower Body'
        },
        10:{
          dateTime:'2017-12-15 20:30:00',
          trainer:'marta',
          details:'Lower Body'
        },
        11:{
          dateTime:'2017-12-16 09:30:00',
          trainer:'cindy',
          details:'Full Body'
        },
        12:{
          dateTime:'2017-12-16 10:30:00',
          trainer:'marta',
          details:'Full Body'
        },
        13:{
          dateTime:'2017-12-17 10:30:00',
          trainer:'boon',
          details:'Full Body'
        }
      }
    },
    'circuit' : {
      id:'gdhJPhzYiYIMyjJe1S0H',
      slug:'circuit',
      name:'Circuit',
      description: "Variety of equipment used in this class will help you develop stamina and strength needed for daily activities.",
      longDescription:"Full body combined with high intensity and 3D loaded movement. Build strength and get powerful, move the way your body was designed to move - in all directions.",
      image:require('./assets/circuit.jpg'),
      maxCapacity:20,
      duration:20,
      venue:'Main Room'
    },
    'motion' : {
      id:'u5HmKakygPFHld6tUQAn',
      slug:'motion',
      name:'Motion',
      description: "One of Babel's signature classes designed to improve the quality of movement by increasing your mobility and stamina.",
      longDescription:"A body weight class designed to teach you more about your postural muscles involving precisely design integrated movements that challenges your strength and stamina. This workout will get you ready for the most challenging sport - the sport of life!",
      image:require('./assets/motion.jpg'),
      maxCapacity:20,
      duration:45,
      venue:'Main Room'
    },
    'rnr' : {
      id:'OWKsRDQEEJy54yse3MA9',
      slug:'rnr',
      name:'RnR',
      description: "De-stress and loosen up with our slow paced RnR class. ",
      longDescription:"This class focuses on two very important components: recovery and regeneration. Applying self-myofascial release techniques and simple sretching exercises will help you to balance out stressed and tight muscles whilst reduce risk of injuries.",
      image:require('./assets/RnR.jpg'),
      maxCapacity:20,
      duration:45,
      venue:'Main Room'
    },
    'suspension' : {
      id:'eIIqxFxATU959bkkjAW9',
      slug:'suspension',
      name:'Suspension',
      description: "Train like a Navy Seal and develop strength, balance and core stability with our suspension based class!",
      longDescription:"System of ropes invented by a former Navy Seal develops your strength and flexibility while challenging your balance. Based on bodyweight exercises, all the programs allow a variety of multi-planar, compound movements.",
      image:require('./assets/suspension.jpg'),
      maxCapacity:20,
      duration:45,
      venue:'Main Room'
    },
    'cync' : {
      id:'K04JWnqmZn4CSQCH2AnX',
      active:true,
      slug:'cync',
      name:'Cync',
      description: "The calorie-torching benefits of cycling are hard to beat. Babel brings a spark to it.",
      longDescription:"Technique. speed, power, climb, high energy cardiovascular workout - everything you need from a cycling session - all in one, paced with the beat of the music and lights to create vivid and unforgattable experience. Can you ask for more?\n* All of Babel's spinning classes are using Technogym's Group Cycle, the world's first and only indoor cycling bike that tracks workouts, helping you to adjust the training and improve performance during a unique riding experience. Cutting-edge technology and its ease of use make it simple and helpful for beginners as well as more experience riders.",
      remarks:"* Spinning shoes not provided",
      image:require('./assets/Cync.jpg'),
      maxCapacity:22,
      duration:45,
      venue:'Spin Room',
      sessions:{
        0:{
          dateTime:'2017-12-11 07:15:00',
          trainer:'dansen'
        },
        1:{
          dateTime:'2017-12-12 18:15:00',
          trainer:'jacq'
        },
        2:{
          dateTime:'2017-12-13 08:15:00',
          trainer:'jacq'
        },
        3:{
          dateTime:'2017-12-13 19:15:00',
          trainer:'cindy'
        },
        4:{
          dateTime:'2017-12-15 08:15:00',
          trainer:'cindy'
        },
        5:{
          dateTime:'2017-12-15 19:15:00',
          trainer:'dansen'
        }
      }
    },
    'peloton' : {
      id:'hg67EvlMrwNKYlIBVFBi',
      active:true,
      slug:'peloton',
      name:'Peloton',
      description: "Fast paced group pedalling could be the fitness boost you're looking for. Why wait?",
      longDescription:"Precisely timed interval session focuses on conditioning and performance to maximize your results. It is designed to push you to a new level of fitness, make you work harder to get stronger and fitter with every ride.",
      remarks:"* Spinning shoes not provided",
      image:require('./assets/Peloton.jpg'),
      maxCapacity:22,
      duration:45,
      venue:'Spin Room',
      sessions:{
        0:{
          dateTime:'2017-12-11 19:15:00',
          trainer:'jacq'
        },
        1:{
          dateTime:'2017-12-12 08:15:00',
          trainer:'cindy'
        },
        2:{
          dateTime:'2017-12-14 18:15:00',
          trainer:'dansen'
        }
      }
    },
    'sandbags' : {
      id:'NulQBnaSMPrGqOV7WvIw',
      slug:'sandbags',
      name:'Sandbags',
      description: "Wanna build serious strength? A loaded barbell it's not your only option !",
      longDescription:"An unconventional full body workout, focused on building strength and endurance. Using bags filled with sand will demand more from your body, as the bag's weight shifts and moves when you do. This dynamic and challenging workout utilize variety of stabilizing muscles which are typically not used during basic lifts.",
      image:require('./assets/sandbags.jpg'),
      maxCapacity:20,
      duration:45,
      venue:'Main Room'
    },
    'bogafit' : {
      id:'LUR1Ak1rRYw8nmdyqzjq',
      slug:'bogafit',
      name:'BogaFIT',
      description: "If you're looking to diversify your workout routine that's definitely it ! Babel's BogaFIT class is not only demanding but also FUN !",
      longDescription:"Babel brings the high intensity classes to the next level! BOGA's unique Fit Mat intensifies the workout bringing more focus to your core muscles to improve balance and coordination. Do you dare?",
      remarks:"* Subject to change due to weather conditions.",
      image:require('./assets/BogaFit.jpg'),
      maxCapacity:8,
      duration:30,
      venue:'Swimming Pool'
    },
    'power-flo-yoga' : {
      id:'fldnTfM70G0JMeG88Qi3',
      slug:'power-flo-yoga',
      name:'Power Flo Yoga',
      description: "Get your heart pumping, build strength and increase flexibility in our dynamic vinyasa based yoga class.",
      longDescription:"If you want a full body workout that will increase your flexibility, strength and tone, as well as leaving you de-stressed and re-energised, then Power Flo is for you. Our Power FLo classes are in the Vinyasa-flow style of yoga. Vinyasa means breath-synchronized movement, and the flow describes the way you will move fluidly from one yoga pose to another in rhythm with your breath.",
      remarks:"* Yoga mats provided.",
      image:require('./assets/power-flo-yoga.jpg'),
      maxCapacity:20,
      duration:60,
      venue:'Main Room'
    },
    'slo-flo-yoga' : {
      id:'YRH3FeRFDfidQiDS4qnL',
      slug:'slo-flo-yoga',
      name:'Slo Flo Yoga',
      description: "Wind down and release stress in our relaxing slower pace Hatha and Yin based yoga class.",
      longDescription:"This gentle form of yoga is appropriate for those who are looking for a softer, nurturing, slow-paced relaxing practice. Slo Flo is great for all levels and in particular for those who are looking to enjoy the therapeutic benefits of yoga.",
      remarks:"* Yoga mats provided.",
      image:require('./assets/slo-flo-yoga.jpg'),
      maxCapacity:20,
      duration:60,
      venue:'Main Room'
    },
    'budokon' : {
      id:'ZmNWBDx2Uyu0fyPaIRCN',
      slug:'budokon',
      name:'Budokon ®',
      description: "Connect with your inner warrior and learn to move like a ninja in our martial arts based yoga class.",
      longDescription:"Budokon ® (also known as BDK) is a unique mixed movements arts training system which integrates mixed martial arts, yoga, calisthenics and animal locomotion. BDK classes focus on controlled movements that will help to improve mobility, agility, flexibility and strength.",
      remarks:"* Yoga mats provided.",
      image:require('./assets/budokon.jpg'),
      maxCapacity:20,
      duration:60,
      venue:'Main Room'
    },
    'flow' : {
      id:'66jEWFcqMPke9lb1eCva',
      slug:'flow',
      name:'Flow',
      description: "Let your body flow to the beat of the music with one of Babel's signature classes.",
      longDescription:"A free flowing workout sync with the music, was inspired by seamless moves of Yoga, Pilates, Martial Arts and basic bodyweight exercises to reshape your body, increase mobility and improve posture. Low impact, high intensity makes the class suitable for everyone.",
      image:require('./assets/flow.jpg'),
      maxCapacity:20,
      duration:45,
      venue:'Main Room'
    },
    'groove-thang' : {
      id:'zcu5A3MGjzy65BNo4aGh',
      slug:'groove-thang',
      name:'Groove Thang',
      description: "In between a dance party and a dance class. This session will get you moving, sweating and feeling good!",
      longDescription:"Focusing on basic grooves, rhythm, coordination, we got you sorted for your moves on the dance floor. Expect tunes ranging from R&B, soul, disco, Hip Hop, urban & pop. This session will get you moving, sweating and feeling good!",
      image:require('./assets/groove-thang.jpg'),
      maxCapacity:20,
      duration:45,
      venue:'Main Room'
    },
    'griind' : {
      id:'JYZgrCR6QHckoA1EYJFu',
      slug:'griind',
      name:'GRIIND',
      description: "Heels are encouraged, not compulsory. This class focuses on sensual lines and movements, to strut with confidence, to own and love your body.",
      longDescription:"This class focuses on sensual lines and movements. Expect fierce struts, sensual body rolls, killer poses, flirty gaze, sassy attitude. We want you to be you and own it! Besides learning dance moves, it also aims to liberate and empower individuals, build confidence and improve posture. Heels are encouraged, not compulsory. Men and women are both welcomed!",
      image:require('./assets/griind.jpg'),
      maxCapacity:20,
      duration:90,
      venue:'Main Room'
    },
    'choreography-by-mayhem' : {
      id:'j8ABepBblDhnvuofNcnJ',
      slug:'choreography-by-mayhem',
      name:'Choreography by Mayhem',
      description: "Get inspired and feel like a pro while learning Mayhem's unique dance routine.",
      longDescription:"A combination of dance movements choreographed to a contemporary/urban/pop tune. Maybelline's style is inspired by basics and grooves from urban dance style that has influence from Hip Hop, Street Jazz, Dancehall and more.",
      image:require('./assets/choreography-by-mayhem.jpg'),
      maxCapacity:20,
      duration:90,
      venue:'Main Room'
    },
    'pilates-mat' : {
      id:'EppsWkJ9MJSoxWXgdcRd',
      slug:'pilates-mat',
      name:'Pilates Mat',
      description: '"Pilates is gaining the mastery of your mind over the complete control over your body." - Joseph Pilates.',
      longDescription: 'An innovative and everlasting method of exercise pioneered by the late Joseph Pilates will improve your balance and posture but predominantly the control of the body. Strong core, increased flexibility and mobility.. are just another benefits of Pilates routine.',
      image:require('./assets/pilates-mat.jpg'),
      maxCapacity:20,
      duration:60,
      venue:'Main Room'
    },
    'pilates-reformer' : {
      id:'csghWyNWltUlxxcNeM1g',
      slug:'pilates-reformer',
      name:'Pilates Reformer',
      description: "Find the quality of movement with our Individual Reformer Sessions. Personaized programs will improve your posture while enhancing performence and preventing common injuries.",
      longDescription: 'An innovative and everlasting method of exercise pioneered by the late Joseph Pilates will improve your balance and posture but predominantly the control of the body. Strong core, increased flexibility and mobility.. are just another benefits of Pilates routine.',
      remarks:"Only available as Individual (1:1) Sessions",
      image:require('./assets/pilates-reformer.jpg'),
      maxCapacity:1,
      duration:60,
      venue:'Reformer Room'
    },
    'aqua-fit' : {
      id:'jgiEcHBTqrQrW9YHB6bm',
      slug:'aqua-fit',
      name:'Aqua Fit',
      description: "Add aquatic exercise into your routine - let it be your workout or an active rest. Soothing and therapeutic effects of water will do the rest.",
      longDescription: "Time to get into the pool! This type of cardiovascular and resistance training designed by our coaches guarantees a total body workout. The class is performed in fairly shallow water and does not include swimming, so don't be afraid to dive into this workout !  Push your heart rate up while avoiding the gravity force and staying gentle on the joints.",
      remarks:"* Subject to change due to weather conditions.",
      image:require('./assets/aqua-fit.jpg'),
      maxCapacity:30,
      duration:45,
      venue:'Swimming Pool'
    }
  })
});
