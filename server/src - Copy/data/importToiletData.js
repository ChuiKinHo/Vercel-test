import xlsx from "xlsx";
import path from "path";
import { Toilet } from "../models/index.js";
import fs from "fs";
// const fs = require('fs');

const importToiletData = async () => {
  try {
    console.log("Loading public toilet data to database...");
    
    // Load the Excel file
    const filePath = path.join(process.cwd(), "src", "data", "toilets.xlsx");
    const workbook = xlsx.readFile(filePath);

    // Extract different toilets data
    const public_toilets_sheet_name = workbook.SheetNames[0];
    const mall_toilets_sheet_name = workbook.SheetNames[1];

    const public_toilets_data = xlsx.utils.sheet_to_json(
      workbook.Sheets[public_toilets_sheet_name]
    );
    const mall_toilets_data = xlsx.utils.sheet_to_json(
      workbook.Sheets[mall_toilets_sheet_name]
    );

    // Combine all toilets data
    const all_toilets_data = [...public_toilets_data];

    const toilets = all_toilets_data.map((row) => ({
      name_en: row.name_en,
      name_zh: row.name_zh,
      address_en: row.address_en,
      address_zh: row.address_zh,
      sub_district_en: row.sub_district_en,
      sub_district_zh: row.sub_district_zh,
      district_en: row.district_en,
      district_zh: row.district_zh,
      area_en: row.area_en,
      area_zh: row.area_zh,
      x_easting: row.x_easting,
      y_northing: row.y_northing,
      location: {
        type: "Point",
        coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)],
      },
      type_of_toilet: row.type_of_toilet,
      isMale: row.isMale,
      isFemale: row.isFemale,
      isDisabled: row.isDisabled,
      haveBathroom: row.haveBathroom,
    }));

    for (const toilet of toilets) {
      await Toilet.updateOne(
        { location: toilet.location },
        { $setOnInsert: toilet },
        { upsert: true }
      );
    }

    // Prepare the bulk operations array
    // const bulkOps = toilets.map(toilet => ({
    //   updateOne: {
    //     filter: { location: toilet.location },
    //     update: { $setOnInsert: toilet },
    //     upsert: true
    //   }
    // }));

    // // Perform the bulk write operation
    // await Toilet.bulkWrite(bulkOps);

    console.log("Toilet data imported successfully.");
  } catch (err) {
    console.error("Error when importing toilets:", err);
  }

  // try {
  //   // Load the Json file
  //   // const filePath = path.join(process.cwd(), "src", "data", "mall_toilets.json");

  //   // Read the JSON file
  //   fs.readFile(path.join(process.cwd(), "src", "data", "mall_toilets.json"), 'utf8', (err, data) => {
  //     if (err) {
  //         console.error(err);
  //         return;
  //     }

  //     const toilets = JSON.parse(data);
  //     toilets.map(toilet => {
  //       toilet.location = {
  //         type: "Point",
  //         coordinates: [toilet.longitude, toilet.latitude]
  //       }
  //     });
  //     console.log(toilets[0].location)
  //     // Prepare the bulk operations array
  //     const bulkOps = toilets.map(toilet => ({
  //       updateOne: {
  //         filter: { location: toilet.location },
  //         update: { $setOnInsert: toilet },
  //         upsert: true
  //       }
  //     }));

  //     // Perform the bulk write operation
  //     Toilet.bulkWrite(bulkOps);
  //   });

  //   // const jsonObject = JSON.parse(jsonString);
  //   // const workbook = xlsx.readFile(filePath);
  //   // const sheetName = workbook.SheetNames[0];
  //   // const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  //   // const toilets = sheetData.map((row) => ({
  //   //   name_en: row.name_en,
  //   //   name_zh: row.name_zh,
  //   //   address_en: row.address_en,
  //   //   address_zh: row.address_zh,
  //   //   sub_district_en: row.sub_district_en,
  //   //   sub_district_zh: row.sub_district_zh,
  //   //   district_en: row.district_en,
  //   //   district_zh: row.district_zh,
  //   //   area_en: row.area_en,
  //   //   area_zh: row.area_zh,
  //   //   x_easting: row.x_easting,
  //   //   y_northing: row.y_northing,
  //   //   location: {
  //   //     type: "Point",
  //   //     coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)],
  //   //   },
  //   // }));

  //   // console.log("Loading mall toilet data to database...");
  //   // for (const toilet of toilets) {
  //   //   await Toilet.updateOne(
  //   //     { location: toilet.location },
  //   //     { $setOnInsert: toilet },
  //   //     { upsert: true }
  //   //   );
  //   // }
  //   console.log("Toilet data imported successfully.");
  // } catch (err) {
  //   console.error("Error when importing toilets:", err);
  // }
};

export default importToiletData;