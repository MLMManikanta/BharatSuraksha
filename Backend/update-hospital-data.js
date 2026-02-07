// MongoDB shell script to update hospital data
db = db.getSiblingDB("BharatSurakshaDB");

print("\n🔄 Updating hospital fields...\n");

const result = db.claims.bulkWrite([
  {
    updateOne: {
      filter: { _id: ObjectId("697655371d197d64927b7b76") },
      update: {
        $set: {
          hospitalName: "Keerthi hospital",
          hospitalAddress: "Vasavi Nagar road, Challapalli 521131",
        },
      },
    },
  },
  {
    updateOne: {
      filter: { _id: ObjectId("697655a21d197d64927b7b80") },
      update: {
        $set: {
          hospitalName: "Keerthi hospital",
          hospitalAddress: "Vasavi Nagar road, Challapalli 521131",
        },
      },
    },
  },
]);

print("\n✅ Update Results:");
print("   Matched: " + result.matchedCount);
print("   Modified: " + result.modifiedCount);
print("\n📊 Verification - All Claims:\n");

db.claims
  .find(
    {},
    {
      referenceId: 1,
      hospitalName: 1,
      hospitalAddress: 1,
      dependentName: 1,
    },
  )
  .forEach(function (claim) {
    print("--------------------------------------------------");
    print("Claim ID: " + (claim.referenceId || claim._id));
    print("Member: " + claim.dependentName);
    print("Hospital: " + (claim.hospitalName || "(empty)"));
    print("Address: " + (claim.hospitalAddress || "(empty)"));
  });

print("\n✨ Migration complete!\n");
