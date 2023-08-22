import { NextResponse } from "next/server";

export default function middleware(req, res, next) {
  let verify = req.cookies.get("user");
  let url = req.url;
  if (!verify && url.includes("/chat")) {
    return NextResponse.redirect("https://nut-chat-me.vercel.app/");
  }

  if (verify && url === "https://nut-chat-me.vercel.app/") {
    return NextResponse.redirect("https://nut-chat-me.vercel.app/");
  }
}
