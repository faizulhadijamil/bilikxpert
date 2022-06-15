const data = Map({
  state: {
    isFetching: {
      classes: true,
      trainers: true,
      sessions: true,
      bookings: true
    },
    booking: {
      data: {},
      label: '',
      success: false,
      failure: false
    },
    classes: {
      classesById: {
        '66jEWFcqMPke9lb1eCva': {
          description: 'Let your body flow to the beat of the music with one of Babel\'s signature classes.',
          duration: 45,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fflow.jpg?alt=media&token=4c53104a-a0a8-43a5-a9f7-43a3ae24117e',
          longDescription: 'A free flowing workout sync with the music, was inspired by seamless moves of Yoga, Pilates, Martial Arts and basic bodyweight exercises to reshape your body, increase mobility and improve posture. Low impact, high intensity makes the class suitable for everyone.',
          maxCapacity: 20,
          name: 'Flow',
          slug: 'flow',
          venue: 'Main Room'
        },
        OWKsRDQEEJy54yse3MA9: {
          description: 'De-stress and loosen up with our slow paced RnR class. ',
          duration: 45,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2FRnR.jpg?alt=media&token=ef391cf7-7f29-42a5-8460-07d47cb376e8',
          longDescription: 'This class focuses on two very important components: recovery and regeneration. Applying self-myofascial release techniques and simple sretching exercises will help you to balance out stressed and tight muscles whilst reduce risk of injuries.',
          maxCapacity: 20,
          name: 'RnR',
          slug: 'rnr',
          venue: 'Main Room'
        },
        jgiEcHBTqrQrW9YHB6bm: {
          longDescription: 'Time to get into the pool! This type of cardiovascular and resistance training designed by our coaches guarantees a total body workout. The class is performed in fairly shallow water and does not include swimming, so don\'t be afraid to dive into this workout !  Push your heart rate up while avoiding the gravity force and staying gentle on the joints.',
          name: 'Aqua Fit',
          slug: 'aqua-fit',
          venue: 'Swimming Pool',
          remarks: '* Subject to change due to weather conditions.',
          duration: 45,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Faqua-fit.jpg?alt=media&token=d39da4d1-3339-4294-8ed3-efc5113b72a7',
          description: 'Add aquatic exercise into your routine - let it be your workout or an active rest. Soothing and therapeutic effects of water will do the rest.',
          maxCapacity: 30
        },
        eIIqxFxATU959bkkjAW9: {
          description: 'Train like a Navy Seal and develop strength, balance and core stability with our suspension based class!',
          duration: 45,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fsuspension.jpg?alt=media&token=ecd8c1e4-352f-450e-afa6-7a7771a86069',
          longDescription: 'System of ropes invented by a former Navy Seal develops your strength and flexibility while challenging your balance. Based on bodyweight exercises, all the programs allow a variety of multi-planar, compound movements.',
          maxCapacity: 20,
          name: 'Suspension',
          slug: 'suspension',
          venue: 'Main Room'
        },
        aay1x3svPUsDmtgxCRrB: {
          longDescription: 'A high intensity interval workout designed to increase athletic performance and set your calories on fire. HIIT keeps you moving and challenges not only your body but also your mind. Bring it, beat it and brag about it !',
          active: true,
          name: 'HIIT',
          slug: 'hiit',
          venue: 'HIIT Room',
          duration: 30,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2FHIIT.jpg?alt=media&token=8cb9eaf5-dc5f-4f02-8fab-ec1302db8fce',
          description: 'Whoever said that a short workout can\'t be effective haven\'t met our Babel Team. Join the HIIT class and see for yourself!',
          sessions: {
            '0': {
              dateTime: '2017-12-11 07:30:00',
              details: 'Upper Body',
              trainer: 'kish'
            },
            '1': {
              dateTime: '2017-12-11 20:30:00',
              details: 'Upper Body',
              trainer: 'jacq'
            },
            '2': {
              dateTime: '2017-12-12 08:30:00',
              details: 'Lower Body',
              trainer: 'dansen'
            },
            '3': {
              dateTime: '2017-12-12 18:30:00',
              details: 'Lower Body',
              trainer: 'jacq'
            },
            '4': {
              dateTime: '2017-12-13 07:30:00',
              details: 'Full Body',
              trainer: 'ridz'
            },
            '5': {
              dateTime: '2017-12-13 20:30:00',
              details: 'Full Body',
              trainer: 'cindy'
            },
            '6': {
              dateTime: '2017-12-14 08:30:00',
              details: 'Upper Body',
              trainer: 'jacq'
            },
            '7': {
              dateTime: '2017-12-14 18:30:00',
              details: 'Upper Body',
              trainer: 'cindy'
            },
            '8': {
              dateTime: '2017-12-14 20:30:00',
              details: 'Upper Body',
              trainer: 'dansen'
            },
            '9': {
              dateTime: '2017-12-15 07:30:00',
              details: 'Lower Body',
              trainer: 'kish'
            },
            '10': {
              dateTime: '2017-12-15 20:30:00',
              details: 'Lower Body',
              trainer: 'marta'
            },
            '11': {
              dateTime: '2017-12-16 09:30:00',
              details: 'Full Body',
              trainer: 'cindy'
            },
            '12': {
              dateTime: '2017-12-16 10:30:00',
              details: 'Full Body',
              trainer: 'marta'
            },
            '13': {
              dateTime: '2017-12-17 10:30:00',
              details: 'Full Body',
              trainer: 'boon'
            }
          },
          maxCapacity: 22
        },
        csghWyNWltUlxxcNeM1g: {
          longDescription: 'An innovative and everlasting method of exercise pioneered by the late Joseph Pilates will improve your balance and posture but predominantly the control of the body. Strong core, increased flexibility and mobility.. are just another benefits of Pilates routine.',
          name: 'Pilates Reformer',
          slug: 'pilates-reformer',
          venue: 'Reformer Room',
          remarks: 'Only available as Individual (1:1) Sessions',
          duration: 60,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fpilates-reformer.jpg?alt=media&token=a9091a79-3ee2-4f6c-8403-374add7bbe6e',
          description: 'Find the quality of movement with our Individual Reformer Sessions. Personaized programs will improve your posture while enhancing performence and preventing common injuries.',
          maxCapacity: 1
        },
        fldnTfM70G0JMeG88Qi3: {
          longDescription: 'If you want a full body workout that will increase your flexibility, strength and tone, as well as leaving you de-stressed and re-energised, then Power Flo is for you. Our Power FLo classes are in the Vinyasa-flow style of yoga. Vinyasa means breath-synchronized movement, and the flow describes the way you will move fluidly from one yoga pose to another in rhythm with your breath.',
          active: true,
          name: 'Power Flo Yoga',
          slug: 'power-flo-yoga',
          venue: 'Main Room',
          remarks: '* Yoga mats provided.',
          duration: 60,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fpower-flo-yoga.jpg?alt=media&token=c3014c98-eaef-43c8-9ecc-f4ba45406e62',
          description: 'Get your heart pumping, build strength and increase flexibility in our dynamic vinyasa based yoga class.',
          maxCapacity: 20
        },
        EppsWkJ9MJSoxWXgdcRd: {
          description: '"Pilates is gaining the mastery of your mind over the complete control over your body." - Joseph Pilates.',
          duration: 60,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fpilates-mat.jpg?alt=media&token=7ea36a2b-acdc-46c0-98fd-eae13651a3ef',
          longDescription: 'An innovative and everlasting method of exercise pioneered by the late Joseph Pilates will improve your balance and posture but predominantly the control of the body. Strong core, increased flexibility and mobility.. are just another benefits of Pilates routine.',
          maxCapacity: 20,
          name: 'Pilates Mat',
          slug: 'pilates-mat',
          venue: 'Main Room'
        },
        K04JWnqmZn4CSQCH2AnX: {
          longDescription: 'Technique. speed, power, climb, high energy cardiovascular workout - everything you need from a cycling session - all in one, paced with the beat of the music and lights to create vivid and unforgattable experience. Can you ask for more?\n* All of Babel\'s spinning classes are using Technogym\'s Group Cycle, the world\'s first and only indoor cycling bike that tracks workouts, helping you to adjust the training and improve performance during a unique riding experience. Cutting-edge technology and its ease of use make it simple and helpful for beginners as well as more experience riders.',
          active: true,
          name: 'Cync',
          slug: 'cync',
          venue: 'Spin Room',
          remarks: '* Spinning shoes not provided',
          duration: 45,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2FCync.jpg?alt=media&token=0cb8266c-527f-4164-b5fc-439a7d588d30',
          description: 'The calorie-torching benefits of cycling are hard to beat. Babel brings a spark to it.',
          sessions: {
            '0': {
              dateTime: '2017-12-11 07:15:00',
              trainer: 'dansen'
            },
            '1': {
              dateTime: '2017-12-12 18:15:00',
              trainer: 'jacq'
            },
            '2': {
              dateTime: '2017-12-13 08:15:00',
              trainer: 'jacq'
            },
            '3': {
              dateTime: '2017-12-13 19:15:00',
              trainer: 'cindy'
            },
            '4': {
              dateTime: '2017-12-15 08:15:00',
              trainer: 'cindy'
            },
            '5': {
              dateTime: '2017-12-15 19:15:00',
              trainer: 'dansen'
            }
          },
          maxCapacity: 22
        },
        NulQBnaSMPrGqOV7WvIw: {
          description: 'Wanna build serious strength? A loaded barbell it\'s not your only option !',
          duration: 45,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fsandbags.jpg?alt=media&token=b1e992af-2051-4e7d-bbee-5477fa43080e',
          longDescription: 'An unconventional full body workout, focused on building strength and endurance. Using bags filled with sand will demand more from your body, as the bag\'s weight shifts and moves when you do. This dynamic and challenging workout utilize variety of stabilizing muscles which are typically not used during basic lifts.',
          maxCapacity: 20,
          name: 'Sandbags',
          slug: 'sandbags',
          venue: 'Main Room'
        },
        ZmNWBDx2Uyu0fyPaIRCN: {
          longDescription: 'Budokon ® (also known as BDK) is a unique mixed movements arts training system which integrates mixed martial arts, yoga, calisthenics and animal locomotion. BDK classes focus on controlled movements that will help to improve mobility, agility, flexibility and strength.',
          name: 'Budokon ®',
          slug: 'budokon',
          venue: 'Main Room',
          remarks: '* Yoga mats provided.',
          duration: 60,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fbudokon.jpg?alt=media&token=f61f1a17-517e-4c7a-8492-c2042751b049',
          description: 'Connect with your inner warrior and learn to move like a ninja in our martial arts based yoga class.',
          maxCapacity: 20
        },
        gdhJPhzYiYIMyjJe1S0H: {
          description: 'Variety of equipment used in this class will help you develop stamina and strength needed for daily activities.',
          duration: 20,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fcircuit.jpg?alt=media&token=c2eaf1e4-ac26-47d2-a699-cfcd340fcb16',
          longDescription: 'Full body combined with high intensity and 3D loaded movement. Build strength and get powerful, move the way your body was designed to move - in all directions.',
          maxCapacity: 20,
          name: 'Circuit',
          slug: 'circuit',
          venue: 'Main Room'
        },
        u5HmKakygPFHld6tUQAn: {
          description: 'One of Babel\'s signature classes designed to improve the quality of movement by increasing your mobility and stamina.',
          duration: 45,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fmotion.jpg?alt=media&token=08253d9c-9468-4f73-89f3-2d9cb62f861f',
          longDescription: 'A body weight class designed to teach you more about your postural muscles involving precisely design integrated movements that challenges your strength and stamina. This workout will get you ready for the most challenging sport - the sport of life!',
          maxCapacity: 20,
          name: 'Motion',
          slug: 'motion',
          venue: 'Main Room'
        },
        YRH3FeRFDfidQiDS4qnL: {
          longDescription: 'This gentle form of yoga is appropriate for those who are looking for a softer, nurturing, slow-paced relaxing practice. Slo Flo is great for all levels and in particular for those who are looking to enjoy the therapeutic benefits of yoga.',
          active: true,
          name: 'Slo Flo Yoga',
          slug: 'slo-flo-yoga',
          venue: 'Main Room',
          remarks: '* Yoga mats provided.',
          duration: 60,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fslo-flo-yoga.jpg?alt=media&token=8af9326e-50b1-459e-8c90-612ba34ec8b4',
          description: 'Wind down and release stress in our relaxing slower pace Hatha and Yin based yoga class.',
          maxCapacity: 20
        },
        JYZgrCR6QHckoA1EYJFu: {
          description: 'Heels are encouraged, not compulsory. This class focuses on sensual lines and movements, to strut with confidence, to own and love your body.',
          duration: 90,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fgriind.jpg?alt=media&token=87177345-3d67-44b1-9315-970dc54b0c0c',
          longDescription: 'This class focuses on sensual lines and movements. Expect fierce struts, sensual body rolls, killer poses, flirty gaze, sassy attitude. We want you to be you and own it! Besides learning dance moves, it also aims to liberate and empower individuals, build confidence and improve posture. Heels are encouraged, not compulsory. Men and women are both welcomed!',
          maxCapacity: 20,
          name: 'GRIIND',
          slug: 'griind',
          venue: 'Main Room'
        },
        hg67EvlMrwNKYlIBVFBi: {
          longDescription: 'Precisely timed interval session focuses on conditioning and performance to maximize your results. It is designed to push you to a new level of fitness, make you work harder to get stronger and fitter with every ride.',
          active: true,
          name: 'Peloton',
          slug: 'peloton',
          venue: 'Spin Room',
          remarks: '* Spinning shoes not provided',
          duration: 45,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2FPeloton.jpg?alt=media&token=1a3c45d9-b707-4036-a0f2-dd9e09620ad8',
          description: 'Fast paced group pedalling could be the fitness boost you\'re looking for. Why wait?',
          sessions: {
            '0': {
              dateTime: '2017-12-11 19:15:00',
              trainer: 'jacq'
            },
            '1': {
              dateTime: '2017-12-12 08:15:00',
              trainer: 'cindy'
            },
            '2': {
              dateTime: '2017-12-14 18:15:00',
              trainer: 'dansen'
            }
          },
          maxCapacity: 22
        },
        zcu5A3MGjzy65BNo4aGh: {
          description: 'In between a dance party and a dance class. This session will get you moving, sweating and feeling good!',
          duration: 45,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fgroove-thang.jpg?alt=media&token=95d233f0-bbbd-4e58-ade9-aadd7e976629',
          longDescription: 'Focusing on basic grooves, rhythm, coordination, we got you sorted for your moves on the dance floor. Expect tunes ranging from R&B, soul, disco, Hip Hop, urban & pop. This session will get you moving, sweating and feeling good!',
          maxCapacity: 20,
          name: 'Groove Thang',
          slug: 'groove-thang',
          venue: 'Main Room'
        },
        LUR1Ak1rRYw8nmdyqzjq: {
          longDescription: 'Babel brings the high intensity classes to the next level! BOGA\'s unique Fit Mat intensifies the workout bringing more focus to your core muscles to improve balance and coordination. Do you dare?',
          name: 'BogaFIT',
          slug: 'bogafit',
          venue: 'Swimming Pool',
          remarks: '* Subject to change due to weather conditions.',
          duration: 30,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2FBogaFit.jpg?alt=media&token=9630ffc1-7a80-42c1-bfd4-93725dafc675',
          description: 'If you\'re looking to diversify your workout routine that\'s definitely it ! Babel\'s BogaFIT class is not only demanding but also FUN !',
          maxCapacity: 8
        },
        j8ABepBblDhnvuofNcnJ: {
          description: 'Get inspired and feel like a pro while learning Mayhem\'s unique dance routine.',
          duration: 90,
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2FPeloton.jpg?alt=media&token=1a3c45d9-b707-4036-a0f2-dd9e09620ad8',
          longDescription: 'A combination of dance movements choreographed to a contemporary/urban/pop tune. Maybelline\'s style is inspired by basics and grooves from urban dance style that has influence from Hip Hop, Street Jazz, Dancehall and more.',
          maxCapacity: 20,
          name: 'Choreography by Mayhem',
          slug: 'choreography-by-mayhem',
          venue: 'Main Room'
        }
      }
    },
    trainers: {
      trainersById: {
        ryKu18l6i8SOjPZlw0Ou: {
          bio: 'Passionate and unorthodox',
          email: 'jacq@babel.fit',
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fjacq.jpg?alt=media&token=af56f766-2d33-4c21-bbb9-9a10652fd0ae',
          name: 'Jacq',
          role: 'Course Facilitator'
        },
        zcUCEdDbp84MjdUSwf6c: {
          bio: null,
          email: 'boon@babel.fit',
          image: null,
          name: 'Boon',
          role: null
        },
        U44naMHLPyuDBwXaA0XY: {
          bio: 'Consistence, persistence, drive and commitment, these are principles that he upholds in life.',
          email: 'ridz@babel.fit',
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fridz.jpg?alt=media&token=b2c47635-269a-4a32-999d-7ceb34f5232d',
          name: 'Ridz',
          role: null
        },
        bozdunV3jhvmG1dxuCMp: {
          bio: 'Turned her passion into a career with a focus on educating females on benefits of strength and conditioning',
          email: 'hanna@babel.fit',
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fhanna.jpg?alt=media&token=5dab5f9e-cb3c-4908-bb25-34a9e3e1fa0d',
          name: 'Hanna',
          role: 'Course Facilitator'
        },
        DOCcSh3GfidTrRKINGPg: {
          bio: 'Fitness enthusiast who was inspired to become a fitness professional with a main goal to inspire people to live better. Now being a personal trainer Cindy is specialized in strength conditioning.',
          email: 'cindy@babel.fit',
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fcindy.jpg?alt=media&token=e9cf5cfd-1b0e-408f-8ed9-f5da8310a9b5',
          name: 'Cindy',
          role: null
        },
        yZyCVecg9kpyKmoOT8sK: {
          bio: 'A Budokon Yoga maestro which is a form of mixed movement arts that complements his love for human functional motions',
          email: 'tony@babel.fit',
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Ftony.jpg?alt=media&token=89d5cd06-e915-45f6-a5ac-613fd8adaea5',
          name: 'Tony',
          role: 'Course Facilitator'
        },
        hMIbwOOR776zdDspa84z: {
          bio: 'Engineer turned fitness enthusiast whom believes in continous learning to better oneself and also a firm believer in paying it forward.',
          email: 'dansen@babel.fit',
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fdansen.jpg?alt=media&token=5cc6c1db-9307-44ff-9edf-e028c9496c6a',
          name: 'Dansen',
          role: 'Education Manager'
        },
        W2swMsZ2uUbHtH74dj7W: {
          bio: 'Rock climber turned Pilates practitioner whom is also interested in endurance sports, injury prevention as well as psychology.',
          email: 'marta@babel.fit',
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fmarta.jpg?alt=media&token=74f613e6-5c5c-4443-98cd-8c739d0c060a',
          name: 'Marta',
          role: 'Course Facilitator'
        },
        w5SoRtxTnku5JuaqYqQE: {
          bio: 'One of the key faces in the dance scene. Multifaceted and highly talented dancer, choreographer, teacher, workshop organiser, music video choreographer and scene influencer',
          email: 'maybelline@babel.fit',
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fmaybelline.jpg?alt=media&token=1b29c699-b618-4a27-bbe5-558494c4faae',
          name: 'Maybelline',
          role: 'Dance Coach'
        },
        Ipy53HLUNw9gp4iAIU51: {
          bio: 'With his amiable personality; it complements his obsession in corrective exercises and post injuries rehab.',
          email: 'kish@babel.fit',
          image: 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Class%20Images%2Fkish.jpg?alt=media&token=bbef0762-29e4-4a45-ad0f-dd01d6fbe39d',
          name: 'Kish',
          role: 'Course Facilitator'
        }
      }
    },
    sessions: {
      sessionsById: {
        '2veOaMzcTw89lnwOdpcV': {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1513040400000,
          startsAt: 1513037700000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        RMd3YxDwybtO2XouWi68: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513296000000,
          startsAt: 1513294200000,
          trainerId: 'Ipy53HLUNw9gp4iAIU51',
          type: 'class'
        },
        brqbEqceWPetbwXuzX3l: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513479600000,
          startsAt: 1513477800000,
          trainerId: 'zcUCEdDbp84MjdUSwf6c',
          type: 'class'
        },
        '4xbV0xeAiQUAA35dqycK': {
          classId: 'K04JWnqmZn4CSQCH2AnX',
          endsAt: 1512950400000,
          startsAt: 1512947700000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        AUEuq3GSZ3crQuTDkvCk: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513645200000,
          startsAt: 1513643400000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        PlcaiY5ZF3dDUc0CXOIv: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1514250000000,
          startsAt: 1514248200000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        gWgr0lQlhwCZXSs1cCsD: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1512997200000,
          startsAt: 1512995400000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        QQprlRTB8CXDvtH8FLT5: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513342800000,
          startsAt: 1513341000000,
          trainerId: 'W2swMsZ2uUbHtH74dj7W',
          type: 'class'
        },
        dxHyZZpPFOJSoBY5T43p: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1514203200000,
          startsAt: 1514200500000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        zW9tBJzXIjPoLsaFRyUG: {
          classId: 'K04JWnqmZn4CSQCH2AnX',
          endsAt: 1513944000000,
          startsAt: 1513941300000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        SnhnD7mKsKbgNkB5UBkC: {
          bookings: {},
          classId: 'fldnTfM70G0JMeG88Qi3',
          endsAt: 1514160000000,
          startsAt: 1514156400000,
          trainerId: 'yZyCVecg9kpyKmoOT8sK',
          type: 'class'
        },
        nLS95V1hPOj49pVXaBtY: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513123200000,
          startsAt: 1513121400000,
          trainerId: 'U44naMHLPyuDBwXaA0XY',
          type: 'class'
        },
        EfYyZjcelXnXUfoK4tlz: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1514602800000,
          startsAt: 1514601000000,
          trainerId: 'zcUCEdDbp84MjdUSwf6c',
          type: 'class'
        },
        LxjKbknz4vBLtgVuHTUO: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1514548800000,
          startsAt: 1514547000000,
          trainerId: 'W2swMsZ2uUbHtH74dj7W',
          type: 'class'
        },
        jhU4OugAS8lSaHnHOhsv: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513555200000,
          startsAt: 1513553400000,
          trainerId: 'Ipy53HLUNw9gp4iAIU51',
          type: 'class'
        },
        E2YcYGwYzhBgaoU73o6v: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513900800000,
          startsAt: 1513899000000,
          trainerId: 'Ipy53HLUNw9gp4iAIU51',
          type: 'class'
        },
        jpi7KzXlM5bHjrWvV7sN: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1512993600000,
          startsAt: 1512990900000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        dQ1UQZcHmlwjGOgu4Q59: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513861200000,
          startsAt: 1513859400000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        ToZXeufbdVoaoHKf4X08: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513818000000,
          startsAt: 1513816200000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        r0s4pHDI6sFn2TucEKtF: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1514084400000,
          startsAt: 1514082600000,
          trainerId: 'zcUCEdDbp84MjdUSwf6c',
          type: 'class'
        },
        Bz0eqhnTYekTvTuOIKPA: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1514419200000,
          startsAt: 1514416500000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        cZOBcsSxmHjKp05qQZlv: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1514599200000,
          startsAt: 1514597400000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        qyGKCWeqa5sZqE0z1FPA: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1513249200000,
          startsAt: 1513246500000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        gnGZAvP6HlhudDE7AmqY: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1514332800000,
          startsAt: 1514331000000,
          trainerId: 'U44naMHLPyuDBwXaA0XY',
          type: 'class'
        },
        HJY3H20NdfgLdNY5kFPP: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1514379600000,
          startsAt: 1514377800000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        wkuHd3jZkXexJRNStyEy: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1513597500000,
          startsAt: 1513595700000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        Fn1aBzgqJ3JIluwRJxIa: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1514422800000,
          startsAt: 1514421000000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        GOYNAn8OZxJkVFtCl1YA: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513249200000,
          startsAt: 1513247400000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        sJTQX5gPDuNovJv6AkDf: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1514206800000,
          startsAt: 1514205000000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        bCTR2sdd1ZvkqceUHuAa: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513040400000,
          startsAt: 1513038600000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        jWuQ3Ze0ZbJKdX8IAhWT: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1514203200000,
          startsAt: 1514200500000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        qiENc0K6qNer4Sgn6sP8: {
          classId: 'K04JWnqmZn4CSQCH2AnX',
          endsAt: 1513904400000,
          startsAt: 1513901700000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        BhpTqQyta1UCBcybZreN: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513256400000,
          startsAt: 1513254600000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        mphYS7DyZD2Sy1KmBlsf: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1514286000000,
          startsAt: 1514284200000,
          trainerId: 'U44naMHLPyuDBwXaA0XY',
          type: 'class'
        },
        jN2HGszx32fUfWEd1N5F: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513170000000,
          startsAt: 1513168200000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        '9S4vsqayd4B79Ob0ECOF': {
          classId: 'K04JWnqmZn4CSQCH2AnX',
          endsAt: 1514548800000,
          startsAt: 1514546100000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        jUZU2BUEq4GbWs3EmmQ0: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513602000000,
          startsAt: 1513600200000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        D5KJTRqeY29pmeKT27zt: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513994400000,
          startsAt: 1513992600000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        lU3Xg4e8KmzwQM61KmDP: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1514419200000,
          startsAt: 1514416500000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        admQVMW2yKNqsZjt5ESv: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1514250000000,
          startsAt: 1514247300000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        tiTy0oX8trXc4EfF4rt5: {
          classId: 'K04JWnqmZn4CSQCH2AnX',
          endsAt: 1513299600000,
          startsAt: 1513296900000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        rIpF9tLD9Jz7O65xOlT2: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1514203200000,
          startsAt: 1514200500000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        gCwDJPbmUzGRclkU3jzY: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1514458800000,
          startsAt: 1514456100000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        sdA054bJi75UFAWWntJG: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513393200000,
          startsAt: 1513391400000,
          trainerId: 'W2swMsZ2uUbHtH74dj7W',
          type: 'class'
        },
        z38FzUZf0Jmk48K240ms: {
          classId: 'K04JWnqmZn4CSQCH2AnX',
          endsAt: 1513076400000,
          startsAt: 1513073700000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        q55UrsTXNd3xWPf1Xhw3: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1513853100000,
          startsAt: 1513851300000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        QUq6jv8N8BRK8llsTjwm: {
          classId: 'K04JWnqmZn4CSQCH2AnX',
          endsAt: 1513681200000,
          startsAt: 1513678500000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        u7xLh2jP3hvZJQJMMlEr: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513998000000,
          startsAt: 1513996200000,
          trainerId: 'W2swMsZ2uUbHtH74dj7W',
          type: 'class'
        },
        yoRGhBk6PbcbvBb92n7L: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513854000000,
          startsAt: 1513852200000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        LeToXO0KLrEFbEnrQCtd: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1512950400000,
          startsAt: 1512948600000,
          trainerId: 'Ipy53HLUNw9gp4iAIU51',
          type: 'class'
        },
        o7E3yVUEST541bpKvyQU: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1514458800000,
          startsAt: 1514456100000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        mbz6hvMItu23xuY7hMmF: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1514250000000,
          startsAt: 1514247300000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        FPvjaUE6Tbj5np2Z9dR8: {
          classId: 'K04JWnqmZn4CSQCH2AnX',
          endsAt: 1513598400000,
          startsAt: 1513595700000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        ADGQXXFjdUBtWwVhdWDb: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1513813500000,
          startsAt: 1513811700000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        WlOdo5vqSEXhyA9TrO0z: {
          classId: 'K04JWnqmZn4CSQCH2AnX',
          endsAt: 1513339200000,
          startsAt: 1513336500000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        Tt8JEPq4QFzMtZCLEui9: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1514250000000,
          startsAt: 1514247300000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        '5BtN389F73EYpJtHLJcF': {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513213200000,
          startsAt: 1513211400000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        JGBd72acnzTSgvKNM7cy: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513944000000,
          startsAt: 1513942200000,
          trainerId: 'W2swMsZ2uUbHtH74dj7W',
          type: 'class'
        },
        gZKzO2nF6VggDjL0crRu: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513681200000,
          startsAt: 1513679400000,
          trainerId: 'U44naMHLPyuDBwXaA0XY',
          type: 'class'
        },
        U25Pa6o5v8t423MKkpPP: {
          classId: 'YRH3FeRFDfidQiDS4qnL',
          endsAt: 1514693700000,
          startsAt: 1514690100000,
          trainerId: 'yZyCVecg9kpyKmoOT8sK',
          type: 'class'
        },
        xDRYItIHP5Cn2Pevpqw3: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1514602800000,
          startsAt: 1514601000000,
          trainerId: 'W2swMsZ2uUbHtH74dj7W',
          type: 'class'
        },
        CdcCaAzEuOcBWCkQDVXH: {
          classId: 'YRH3FeRFDfidQiDS4qnL',
          endsAt: 1514088900000,
          startsAt: 1514085300000,
          trainerId: 'yZyCVecg9kpyKmoOT8sK',
          type: 'class'
        },
        zsw5fqYhIBJaYJaznFWn: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1514458800000,
          startsAt: 1514456100000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        phGu3HjpEOxlRDL044CH: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1514419200000,
          startsAt: 1514416500000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        joUiHVSqYoLU35z8HUlu: {
          classId: 'K04JWnqmZn4CSQCH2AnX',
          endsAt: 1514509200000,
          startsAt: 1514506500000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        pDGDi18KEK1luTimf4ZW: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1514505600000,
          startsAt: 1514503800000,
          trainerId: 'Ipy53HLUNw9gp4iAIU51',
          type: 'class'
        },
        xhVUbShr86YsGISHH9Uf: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1514458800000,
          startsAt: 1514456100000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        Nvyr90DqHpcN6IHbSgQS: {
          classId: 'K04JWnqmZn4CSQCH2AnX',
          endsAt: 1514160000000,
          startsAt: 1514157300000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        k7ovVp77wW6OHKdEdBoc: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1514160000000,
          startsAt: 1514158200000,
          trainerId: 'Ipy53HLUNw9gp4iAIU51',
          type: 'class'
        },
        rXkCNPpdB7MtMykRVZEZ: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513389600000,
          startsAt: 1513387800000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        '3lZ86XiwNYmLc8jrppyG': {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1514203200000,
          startsAt: 1514200500000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        Fjt77ZuPJQqdiRDHJzJk: {
          classId: 'K04JWnqmZn4CSQCH2AnX',
          endsAt: 1514286000000,
          startsAt: 1514283300000,
          trainerId: 'hMIbwOOR776zdDspa84z',
          type: 'class'
        },
        '1mYX7mVq3n5VUGqUNfcJ': {
          classId: 'fldnTfM70G0JMeG88Qi3',
          endsAt: 1514291400000,
          startsAt: 1514287800000,
          trainerId: 'yZyCVecg9kpyKmoOT8sK',
          type: 'class'
        },
        xQNn7Bfgxt5QOF8DxikW: {
          classId: 'K04JWnqmZn4CSQCH2AnX',
          endsAt: 1513166400000,
          startsAt: 1513163700000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        '76TpQ5Blj2yrvWXlcpd6': {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1514250000000,
          startsAt: 1514247300000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        pF2mTnoPOJ8wwVRxKzUy: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1513644300000,
          startsAt: 1513642500000,
          trainerId: 'DOCcSh3GfidTrRKINGPg',
          type: 'class'
        },
        KZ3lkoP3v6Z6NbT0DAbH: {
          classId: 'hg67EvlMrwNKYlIBVFBi',
          endsAt: 1514419200000,
          startsAt: 1514416500000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        yKmsfPgRJIfdulKTef1e: {
          classId: 'aay1x3svPUsDmtgxCRrB',
          endsAt: 1513076400000,
          startsAt: 1513074600000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        },
        mYDNfvztDuB6rypuR5E0: {
          classId: 'K04JWnqmZn4CSQCH2AnX',
          endsAt: 1513126800000,
          startsAt: 1513124100000,
          trainerId: 'ryKu18l6i8SOjPZlw0Ou',
          type: 'class'
        }
      }
    },
    bookings: {
      bookingsById: {}
    },
    user: {
      id: 'kRwuctEL4nUrUC4Zgi8XOuS6KDA3',
      createdAt: '2017-12-15T06:25:00.369Z',
      displayName: 'shara@gmail.com',
      email: 'shara@gmail.com',
      updatedAt: '2017-12-15T06:25:00.369Z'
    }
  },
  router: {
    location: {
      pathname: '/',
      search: '',
      hash: ''
    }
  }
}
)
