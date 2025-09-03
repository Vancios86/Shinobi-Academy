const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  about: {
    pageTitle: {
      type: String,
      required: true,
      default: "About us"
    },
    founderSection: {
      title: {
        type: String,
        required: true,
        default: "Colin Byrne"
      },
      subtitle: {
        type: String,
        required: true,
        default: "Founder & Head Coach"
      },
      description: {
        type: String,
        required: true,
        default: `Colin Byrne is a martial artist. Started training in 1997 in
        Ninjutsu and became a 3rd Dan Black Belt under Brian McCarthy. He
        has trained with Brian McCarthy with the US Marine corp and Police
        in arrest and constraint. As well he trained and fought Muay Thai
        in Thailand, has a brown belt in Brazilian Jiu Jitsu, obtained a
        silver medal in the European Jiu-Jitsu championships and has
        trained and fought in MMA since 2001. He is part of Team Conor
        McGregor for the last 7 years and has been a corner man for his
        last 3 fights. He is a founding member of McGregor FAST. He
        established Shinobi Academy in 2001 in Lagos Portugal and over the
        years he has welcomed several BJJ, MMA and Kick boxing teams. Many
        great names have trained and coached here:`
      },
      achievements: [{
        type: String,
        default: []
      }],
      facilityDescription: {
        type: String,
        required: true,
        default: `The Facility has 2 large matted rooms for martial arts as well as
        an assortment of bags for striking. The strength and conditioning
        room has 2 Olympic lifting platforms , 2 lifting racks, hack squat
        machine, reverse hyper machine, sleds, Wattbike, Concept 2 rower ,
        inversion table and more.`
      }
    },
    coachesSection: {
      title: {
        type: String,
        required: true,
        default: "SHINOBI COACHES"
      },
      description: {
        type: String,
        required: true,
        default: "Our team of experienced coaches dedicated to your martial arts journey."
      }
    },
    asideSection: {
      title: {
        type: String,
        required: true,
        default: "Training Camps & Facilities"
      },
      description: {
        type: String,
        required: true,
        default: `The Dojo is available for training camps for teams and clubs.
        The strength and conditioning room is also available for small
        groups . We also run our own training camps. MMA and Grappling
        with guest coaches throughout the year.`
      },
      viewDescription: {
        type: String,
        required: true,
        default: `Shinobi Academy is as well known for having one the best views
        in the entire world. If you don't believe me, check out this
        capture and I dare you to prove me wrong:).`
      },
      facilitiesImage: {
        type: String,
        required: true,
        default: "shinobi-view.webp"
      }
    }
  }
}, {
  timestamps: true
});

// Ensure only one content document exists
ContentSchema.statics.getContent = async function() {
  let content = await this.findOne();
  if (!content) {
    content = new this();
    await content.save();
  }
  return content;
};

module.exports = mongoose.model('Content', ContentSchema);
