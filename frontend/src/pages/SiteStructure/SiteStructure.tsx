import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { crawlsApi } from "../../api/crawls.api";
import { useCrawls } from "../../hooks/useCrawls";
import Layout from "../../components/Layout/Layout";
import {
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  Globe,
  Loader2,
} from "lucide-react";
import { useProjectStore } from "../../store/projectStore";

interface PageNode {
  name: string;
  path: string;
  url?: string;
  title?: string;
  statusCode?: number;
  children: PageNode[];
  isOpen?: boolean;
}

const buildTree = (pages: any[]): PageNode => {
  const root: PageNode = {
    name: "root",
    path: "/",
    children: [],
    isOpen: true,
  };

  pages.forEach((page) => {
    try {
      const url = new URL(page.url);
      const parts = url.pathname.split("/").filter((p) => p);
      let currentNode = root;

      parts.forEach((part, index) => {
        let child = currentNode.children.find((c) => c.name === part);

        if (!child) {
          child = {
            name: part,
            path: currentNode.path + part + "/",
            children: [],
            // Auto open first level folders
            isOpen: index === 0,
          };
          currentNode.children.push(child);
        }

        currentNode = child;
      });

      // Set file data on the leaf node or the folder if it represents a page
      // Note: A folder can also be a page (e.g. /blog/)
      currentNode.url = page.url;
      currentNode.title = page.title;
      currentNode.statusCode = page.statusCode;
    } catch (e) {
      console.error("Invalid URL:", page.url);
    }
  });

  return root;
};

const TreeNode = ({ node, level = 0 }: { node: PageNode; level?: number }) => {
  const [isOpen, setIsOpen] = useState(node.isOpen);
  const hasChildren = node.children.length > 0;
  const isFile =
    !!node.url &&
    (!hasChildren ||
      node.url.endsWith(".html") ||
      node.url.endsWith(".php") ||
      !node.url.endsWith("/"));

  // Sort children: folders first, then files
  const sortedChildren = [...node.children].sort((a, b) => {
    const aIsFolder = a.children.length > 0;
    const bIsFolder = b.children.length > 0;
    if (aIsFolder && !bIsFolder) return -1;
    if (!aIsFolder && bIsFolder) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="select-none">
      <div
        className={`
          flex items-center py-1.5 px-2 hover:bg-slate-50 cursor-pointer rounded-lg group transition-colors
          ${level === 0 ? "mb-1" : ""}
        `}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        <div className="mr-2 text-slate-400">
          {hasChildren ? (
            isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
        </div>

        <div className={`mr-2 ${isFile ? "text-slate-400" : "text-amber-400"}`}>
          {isFile ? (
            <FileText className="w-4 h-4" />
          ) : isOpen ? (
            <FolderOpen className="w-4 h-4" />
          ) : (
            <Folder className="w-4 h-4" />
          )}
        </div>

        <div className="flex items-center justify-between flex-1 min-w-0">
          <div className="flex items-center min-w-0">
            <span
              className={`text-sm truncate mr-3 ${
                isFile
                  ? "text-slate-700 font-medium"
                  : "text-slate-800 font-bold"
              }`}
            >
              {node.name === "root" ? "/" : node.name}
            </span>
            {node.title && (
              <span className="text-xs text-slate-400 truncate max-w-[200px] hidden md:block">
                {node.title}
              </span>
            )}
          </div>

          {node.statusCode && (
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-2 ${
                node.statusCode >= 200 && node.statusCode < 300
                  ? "bg-emerald-100 text-emerald-600"
                  : node.statusCode >= 300 && node.statusCode < 400
                    ? "bg-amber-100 text-amber-600"
                    : "bg-rose-100 text-rose-600"
              }`}
            >
              {node.statusCode}
            </span>
          )}
        </div>
      </div>

      {hasChildren && isOpen && (
        <div>
          {sortedChildren.map((child) => (
            <TreeNode key={child.path} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function SiteStructure() {
  const { projectId } = useParams();
  const { currentProject } = useProjectStore();
  const { data: crawls = [] } = useCrawls(
    projectId ? parseInt(projectId) : null
  );

  // Get latest crawl
  const latestCrawl = crawls[0];

  const { data: pagesData, isLoading } = useQuery({
    queryKey: ["crawl-pages", latestCrawl?.id],
    queryFn: () => crawlsApi.getPages(latestCrawl.id),
    enabled: !!latestCrawl?.id,
  });

  const tree = useMemo(() => {
    if (!pagesData?.pages) return null;
    return buildTree(pagesData.pages);
  }, [pagesData]);

  if (!projectId) return null;

  return (
    <Layout title={`Site Structure: ${currentProject?.url || "Loading..."}`}>
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-900">Site Structure</h2>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Folder structure based on pages found in the latest crawl
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : !tree ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">
            No Data Available
          </h3>
          <p className="text-slate-500">
            {!latestCrawl
              ? "No crawls found directly for this project."
              : "No pages found in the last crawl."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Globe className="w-3 h-3 mr-2" />
            {currentProject?.url} ({pagesData.pages.length} Pages)
          </div>
          <div className="p-4 overflow-x-auto">
            <TreeNode node={tree} />
          </div>
        </div>
      )}
    </Layout>
  );
}
