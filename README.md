# SFF Compare

**SFF Compare** is an online tool that lets you easily search for small form factor (SFF) PC cases.

SFF Compare is purely a frontend for the data provided by **SFF Master List** maintained by [u/prayogahs](https://reddit.com/u/prayogahs/) and [u/ermac-318](https://reddit.com/u/ermac-318/).

## 3D Viewer

SFF Compare comes with a **3D viewer** to compare case sizes. Simply select any case by clicking on the table checkboxes, and open the **3D View** panel. You can add your own custom cases to the scene.

## What is this repository?

This repository includes the following:

1. A **bootstrap** script that fetches the data from google sheet, cleans it up, and writes it to a MongoDB database. This script is meant to be run on schedule on a VPS (as a cron job) or as a serverless function.
2. A **docker-compose.yml** to easily spin up a local MongoDB database for development purposes (requires Docker).
3. A **Next.js** app comprising of the web frontend and required API routes.

# 3D models credits

SFF Compare uses the following 3D models as part of the 3D viewer:

https://grabcad.com/library/24-monitor-ecran-24-pouces-1

https://grabcad.com/library/24-monitor-ecran-24-pouces-1

https://grabcad.com/library/asus-rog-swift-pg348q-approximate-1