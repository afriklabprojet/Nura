import { beforeEach, describe, expect, it, vi } from "vitest"

const getHomeContent = vi.fn()

vi.mock("../home-content", () => ({ getHomeContent }))

const { getSiteSettings } = await import("../site-settings")

const withSocial = (social: Record<string, unknown>, hidden: string[] = []) =>
  getHomeContent.mockResolvedValue({
    blocks: { site_settings: { email: "contact@nura-paris.com", social } },
    hidden,
  })

describe("getSiteSettings — social links", () => {
  beforeEach(() => getHomeContent.mockReset())

  it("keeps valid https profile URLs", async () => {
    withSocial({
      instagram: "https://instagram.com/nura",
      tiktok: "https://www.tiktok.com/@nura",
    })

    expect((await getSiteSettings()).social).toEqual({
      instagram: "https://instagram.com/nura",
      tiktok: "https://www.tiktok.com/@nura",
    })
  })

  it("blanks dangerous or non-https values so no link is rendered", async () => {
    withSocial({
      instagram: "javascript:alert(1)",
      tiktok: "data:text/html,<script>alert(1)</script>",
    })
    expect((await getSiteSettings()).social).toEqual({ instagram: "", tiktok: "" })

    withSocial({ instagram: "http://instagram.com/nura", tiktok: "//evil.com" })
    expect((await getSiteSettings()).social).toEqual({ instagram: "", tiktok: "" })

    withSocial({ instagram: "https://u:p@evil.com", tiktok: "/store" })
    expect((await getSiteSettings()).social).toEqual({ instagram: "", tiktok: "" })
  })

  it("validates each network independently", async () => {
    withSocial({ instagram: "https://instagram.com/nura", tiktok: "javascript:x" })

    expect((await getSiteSettings()).social).toEqual({
      instagram: "https://instagram.com/nura",
      tiktok: "",
    })
  })

  it("returns empty links when the block is missing, hidden or incomplete", async () => {
    getHomeContent.mockResolvedValue({ blocks: {}, hidden: [] })
    expect((await getSiteSettings()).social).toEqual({ instagram: "", tiktok: "" })

    withSocial({ instagram: "https://instagram.com/nura" }, ["site_settings"])
    expect((await getSiteSettings()).social).toEqual({ instagram: "", tiktok: "" })

    withSocial({})
    expect((await getSiteSettings()).social).toEqual({ instagram: "", tiktok: "" })
  })
})
