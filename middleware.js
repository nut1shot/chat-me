import { NextResponse } from "next/server";

export default function middleware(req, res, next) {
  let verify = req.cookies.get("user");
  let url = req.url;
  if (!verify && url.includes("/chat")) {
    return NextResponse.redirect("http://localhost:3000/");
  }

  if (verify && url === "http://localhost:3000/") {
    return NextResponse.redirect("http://localhost:3000/");
  }
}
