# How does this work?

![Demo](https://github.com/ramvignesh-b/repo-scrubber/blob/master/src/assets/demo.gif)

Repo Scrubber allows you to choose and delete multiple public GitHub repositories at once.
This app was primarily built on Angular (13) and Bootstrap 5, hosted on GitHub, and is served via Cloudflare Pages.

## Why did I decide to build this?

I was a typical GitHub user, forking all the cool repos I came across and dumping all my projects to GitHub 😅 (even when I knew nothing about Git commands). When I finally decided to follow the industry-level best-practices, I wanted to start by cleaning my workspace of all the dumps and forks that I had never worked on or contributed to, and I knew that manually deleting a repo from GitHub is time-consuming and tedious. After rummaging through the endless articles and forums, I found a few people who figured out a way to delete repo from the comfort of shell scripts. Eventhough it gets the job done without having to 'type the repo name into the input field for confirming the deletion', something felt off on user-perspective. 🤔 That's when I decided to implement a similar logic in a web application, but this time add the functionality to delete multiple repos in just a few clicks, with a hassle free user experience. 😀
Thanks to this project, I got hands dirty on Bootstrap 5 (which I have been wanting to, for a really long time) and renewed my Angular skillset.🙂 

## Future development:

Disclaimer -- currently you cannot use this tool to delete private repo. As for the future development, I may or may not be adding tiny details and additional features, like powerful filters -- based on activity, date, organisation etc -- and probably other user controls. Feel free to fork the repo and make contributions. 🙂 Good luck and happy scrubbing 👍! 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

