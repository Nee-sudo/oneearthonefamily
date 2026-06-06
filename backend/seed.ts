import { User } from './models/User';
import { Post } from './models/Post';
import { Comment } from './models/Comment';
import { ChatRoom } from './models/ChatRoom';
import { Counter } from './models/Counter';

export const seedDatabaseIfEmpty = async () => {
  try {
    // 1. Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding administrative citizens...');
      const defaultUsers = [
        {
          _id: "arjun@oneearth.io",
          name: "Arjun Patel",
          username: "@arjun_vision",
          email: "arjun@oneearth.io",
          dob: "1994-04-12",
          territory: "India",
          flagEmoji: "🇮🇳",
          gender: "Male",
          currentRank: "Royal Candidate",
          knowledgeCredits: 340,
          contributionCredits: 180,
          reputationScore: 99,
          personalityTraits: "Visionary,Leader,Philosopher,Teacher,Humanitarian",
          bio: "Coordinating organic local waste recycling systems in Maharashtra. Let's build the empire from the soil.",
          isCandidate: true,
          campaignVision: "United Global Ecological Safeguards",
          campaignManifesto: "My campaign centers around tying modern technology directly with micro-farming community actions. Let's make every territory garden green.",
          votesCount: 12,
          onboardingCompleted: true,
          citizenOathAccepted: true
        },
        {
          _id: "clara@oneearth.io",
          name: "Clara Dupont",
          username: "@clara_sage",
          email: "clara@oneearth.io",
          dob: "1990-11-20",
          territory: "France",
          flagEmoji: "🇫🇷",
          gender: "Female",
          currentRank: "Guardian",
          knowledgeCredits: 410,
          contributionCredits: 150,
          reputationScore: 98,
          personalityTraits: "Scientist,Educator,Philosopher,Visionary,Creator",
          bio: "Physics educator. Translating scientific literacy into open global civic solutions.",
          isCandidate: true,
          campaignVision: "Absolute Scientific Open Access",
          campaignManifesto: "Education is the foundation of meritocratic leadership. I intend to build the Open Digital Library with zero economic payload.",
          votesCount: 15,
          onboardingCompleted: true,
          citizenOathAccepted: true
        },
        {
          _id: "kofi@oneearth.io",
          name: "Kofi Mensah",
          username: "@kofi_builder",
          email: "kofi@oneearth.io",
          dob: "1988-06-03",
          territory: "Kenya",
          flagEmoji: "🇰🇪",
          gender: "Male",
          currentRank: "Contributor",
          knowledgeCredits: 175,
          contributionCredits: 210,
          reputationScore: 97,
          personalityTraits: "Builder,Humanitarian,Leader,Explorer,Creator",
          bio: "Constructing modular solar installations in dry-zones across East Africa.",
          isCandidate: true,
          campaignVision: "Grassroots Infrastructure Mobilization",
          campaignManifesto: "Action outweighs debate. I will introduce regional solar and clean water blueprints as active Imperial missions for collective credit.",
          votesCount: 8,
          onboardingCompleted: true,
          citizenOathAccepted: true
        }
      ];

      for (const u of defaultUsers) {
        await User.create(u);
      }
      console.log('✅ Users seeded successfully.');
    }

    // 2. Initialize sequence counters so incremental primary keys match 
    const counterCount = await Counter.countDocuments();
    if (counterCount === 0) {
      await Counter.insertMany([
        { id: 'post_id', seq: 3 },
        { id: 'comment_id', seq: 3 },
        { id: 'room_id', seq: 0 },
        { id: 'message_id', seq: 0 }
      ]);
      console.log('🌱 Sequence Counters initialized.');
    }

    // 3. Seed Posts
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      console.log('🌱 Seeding default global feed posts...');
      const defaultPosts = [
        {
          id: 1,
          authorId: "gandhi_avatar",
          authorName: "Arjun Patel",
          authorUsername: "@arjun_vision",
          authorRank: "Royal Candidate",
          authorTerritory: "India",
          authorFlag: "🇮🇳",
          content: "We have completed the micro-reservoir blueprint. By shifting our daily action from empty popularity loops, we spent 40 hours building an irrigation system for 3 smallholder farms. Here is the open-access guide to local sand-dams.",
          category: "Article",
          timestamp: Date.now() - 3600000 * 24, // 1 day ago
          knowledgeValue: 18,
          contributionProof: 24,
          reputationImpact: 99
        },
        {
          id: 2,
          authorId: "clara_nobel",
          authorName: "Clara Dupont",
          authorUsername: "@clara_sage",
          authorRank: "Guardian",
          authorTerritory: "France",
          authorFlag: "🇫🇷",
          content: "What is the collective responsibility of technological builders when designing attention architectures? We should explicitly reject arbitrary metric casinos in favor of qualitative dialogue focus. Join our structural inquiry.",
          category: "Inquiry",
          timestamp: Date.now() - 3600000 * 12, // 12 hours ago
          knowledgeValue: 35,
          contributionProof: 12,
          reputationImpact: 98
        },
        {
          id: 3,
          authorId: "kenya_leader",
          authorName: "Kofi Mensah",
          authorUsername: "@kofi_builder",
          authorRank: "Contributor",
          authorTerritory: "Kenya",
          authorFlag: "🇰🇪",
          content: "The solar micro-grid model for Lake Victoria fishing villages has successfully completed 120 run-hours. To combat grid-vulnerability, we implemented locally serviceable battery units. Looking for developers to join the telemetry code debaters.",
          category: "Debate",
          timestamp: Date.now() - 3600000 * 4, // 4 hours ago
          knowledgeValue: 15,
          contributionProof: 32,
          reputationImpact: 97
        }
      ];

      for (const p of defaultPosts) {
        await Post.create(p);
      }
      console.log('✅ Posts seeded successfully.');
    }

    // 4. Seed Comments
    const commentCount = await Comment.countDocuments();
    if (commentCount === 0) {
      console.log('🌱 Seeding comments...');
      const defaultComments = [
        {
          id: 1,
          postId: 1,
          authorName: "Clara Dupont",
          authorFlag: "🇫🇷",
          authorRank: "Guardian",
          content: "This sand-dam technique is spectacular Arjun. The physics of sediment water retention is pristine.",
          timestamp: Date.now() - 7000000
        },
        {
          id: 2,
          postId: 1,
          authorName: "Kofi Mensah",
          authorFlag: "🇰🇪",
          authorRank: "Contributor",
          content: "Can we customize these sand-dams for clay-heavy soil profiles? Let's check with some geologists in Kenya.",
          timestamp: Date.now() - 3000000
        },
        {
          id: 3,
          postId: 2,
          authorName: "Arjun Patel",
          authorFlag: "🇮🇳",
          authorRank: "Noble",
          content: "Indeed Clara. Depth of connection directly protects systemic human sanity.",
          timestamp: Date.now() - 10000000
        }
      ];

      for (const c of defaultComments) {
        await Comment.create(c);
      }
      console.log('✅ Comments seeded successfully.');
    }

  } catch (error) {
    console.error('⚠️ Seeding check failed:', error);
  }
};
