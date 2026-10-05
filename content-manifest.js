/* OUR ARCHIVE — edit this file only. Counts of 0 are simply hidden. Dates use YYYY-MM-DD. */
const SETTINGS = {
  person1: "Eshan",
  person2: "Siddhi",
  relationshipStart: "",   // e.g. "2024-02-14"
  firstMeeting: "",        // optional
  firstProposal: "",       // optional
  created: "",             // date this archive was created
  revision: 0,             // 0 = auto-calculated
  secret: "Write your private message for the #secret room here.",
  note: "Babyyyy, Ill complete it 😅, and I Love you Soo Much 🥰😘"
};

const CONTENT = {
  // pics: count = how many 1.jpg, 2.jpg ... exist in pics/<Name>/
  pics: {
    Him:      { count: 0, description: "Photographs preserved from the personal archive of Eshan Jain." },
    Her:      { count: 131, description: "Photographs preserved from the personal archive of Siddhi." },
    Together: { count: 19, description: "Photographs documenting the two of them in the same frame." }
  },
  // Each blog folder: Blogs/<year>/Blog <id>/1.txt, 1.jpg ...
  blogs: [
      {
          year: 1,
          title: "The Beginning",
          blogs: [

              {
                  id: 1,
                  title: "The Night I Wasn't Supposed to Meet You",
                  date: "",
                  summary: "How one ordinary night unexpectedly became the beginning of everything.",
                  folder: "Blogs/1/Blog 1",
                  textCount: 1,
                  imageCount: 0
              },

              {
                  id: 2,
                  title: "I Used to Think I Knew What Love Was",
                  date: "",
                  summary: "What I thought love was, and what I slowly learned it actually meant.",
                  folder: "Blogs/1/Blog 2",
                  textCount: 1,
                  imageCount: 0
              },

              {
                  id: 3,
                  title: "It Was Never the Big Things",
                  date: "",
                  summary: "The little moments, habits and ordinary memories that became important.",
                  folder: "Blogs/1/Blog 3",
                  textCount: 1,
                  imageCount: 0
              },

              {
                  id: 4,
                  title: "The Hardest Part Is the Distance",
                  date: "",
                  summary: "What long distance has taught me about love, patience, mistakes and choosing each other.",
                  folder: "Blogs/1/Blog 4",
                  textCount: 1,
                  imageCount: 0
              },

              {
                  id: 5,
                  title: "If I Could Show You Yourself Through My Eyes",
                  date: "",
                  summary: "The way I see Siddhi, the person she is, and the person she is becoming.",
                  folder: "Blogs/1/Blog 5",
                  textCount: 1,
                  imageCount: 0
              }

          ]
      }
  ],
  // { name: "Proposal", date: "2025-01-01", category: "Milestone", folder: "Dates/Proposal", textCount: 2, imageCount: 4, summary: "", related: [] }
  dates: [],
  // { name: "Goa", date: "2025-03-01", duration: "5 days", members: "Both", folder: "Trips/Goa", textCount: 3, imageCount: 6, stops: ["Airport","Beach"] }
  trips: [],
  // { title: "On distance", date: "2025-06-01", author: "Eshan", recipient: "[HER NAME]", text: "Paragraphs separated by blank lines." }
  letters: [],
  // { title: "Phrase she says", text: "Short note" }
  little: [],
  // Extra milestones: { date: "2024-02-14", title: "First meeting", summary: "", href: "#/dates" }
  timeline: [],
  // Article sections. Sections with an empty body are hidden (Overview auto-fills).
  article: {
    sections: [
      { title: "Overview", body: "" }, { title: "How We Met", body: "" }, { title: "Beginning", body: "" },
      { title: "Important Moments", body: "" }, { title: "Long Distance", body: "" }, { title: "Milestones", body: "" },
      { title: "Things That Changed", body: "" }, { title: "Shared Experiences", body: "" }, { title: "Present Day", body: "" }
    ],
    notes: [] // footnotes, e.g. "Private conversation, March 2024."
  }
};
